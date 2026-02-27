const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { query } = require("./_db");
const { json, signJWT } = require("./_auth");

const schema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(1)
});

async function getRoles(uid) {
  const r = await query(
    `select roles.name
     from user_roles
     join roles on roles.id=user_roles.role_id
     where user_roles.user_id=$1`,
    [uid]
  );
  return r.rows.map(x => x.name);
}

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { identifier, password } = schema.parse(body);

    const u = await query(
      `select id, username, phone, password_hash, full_name, grade
       from users
       where username=$1 or phone=$1`,
      [identifier]
    );
    if (u.rowCount === 0) return json(401, { error: "بيانات الدخول غير صحيحة" });

    const user = u.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return json(401, { error: "بيانات الدخول غير صحيحة" });

    const roles = await getRoles(user.id);
    const token = signJWT({ uid: user.id });

    return json(200, {
      token,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        fullName: user.full_name,
        grade: user.grade,
        roles
      }
    });
  } catch (e) {
    return json(400, { error: e.message });
  }
};
