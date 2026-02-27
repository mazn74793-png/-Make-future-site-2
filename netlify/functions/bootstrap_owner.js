const bcrypt = require("bcryptjs");
const { query } = require("./_db");
const { json, signJWT } = require("./_auth");

exports.handler = async () => {
  try {
    const username = process.env.BOOTSTRAP_OWNER_USERNAME;
    const phone = process.env.BOOTSTRAP_OWNER_PHONE;
    const password = process.env.BOOTSTRAP_OWNER_PASSWORD;
    const fullName = process.env.BOOTSTRAP_OWNER_FULLNAME || "Owner";
    const parentPhone = process.env.BOOTSTRAP_OWNER_PARENTPHONE || phone;
    const grade = process.env.BOOTSTRAP_OWNER_GRADE || "third_secondary";

    if (!username || !phone || !password) {
      return json(400, { error: "Missing BOOTSTRAP_OWNER_* env vars" });
    }

    const exists = await query("select id from users where username=$1 or phone=$2", [username, phone]);
    if (exists.rowCount > 0) {
      return json(200, { ok: true, note: "Owner already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const ins = await query(
      `insert into users(username, phone, password_hash, full_name, parent_phone, grade)
       values($1,$2,$3,$4,$5,$6) returning id`,
      [username, phone, password_hash, fullName, parentPhone, grade]
    );

    const userId = ins.rows[0].id;

    const roleId = (await query("select id from roles where name='owner'")).rows[0].id;
    await query("insert into user_roles(user_id, role_id) values($1,$2)", [userId, roleId]);

    const token = signJWT({ uid: userId });

    return json(200, {
      token,
      user: { id: userId, username, phone, fullName, grade, roles: ["owner"] }
    });
  } catch (e) {
    return json(500, { error: e.message });
  }
};
