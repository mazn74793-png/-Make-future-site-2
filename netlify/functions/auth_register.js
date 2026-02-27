const bcrypt = require("bcryptjs");
const { z } = require("zod");
const { query } = require("./_db");
const { json, signJWT } = require("./_auth");

const schema = z.object({
  fullName: z.string().min(2),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_\.]+$/),
  phone: z.string().min(8).max(20),
  parentPhone: z.string().min(8).max(20),
  grade: z.enum(["third_prep","first_secondary","second_secondary","third_secondary"]),
  password: z.string().min(6).max(100)
});

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const data = schema.parse(body);

    const exists = await query("select id from users where username=$1 or phone=$2", [data.username, data.phone]);
    if (exists.rowCount > 0) return json(400, { error: "Username أو رقم الموبايل مستخدم بالفعل" });

    const password_hash = await bcrypt.hash(data.password, 10);

    const ins = await query(
      `insert into users(username, phone, password_hash, full_name, parent_phone, grade)
       values($1,$2,$3,$4,$5,$6) returning id`,
      [data.username, data.phone, password_hash, data.fullName, data.parentPhone, data.grade]
    );

    const uid = ins.rows[0].id;
    const token = signJWT({ uid });

    return json(200, {
      token,
      user: { id: uid, username: data.username, phone: data.phone, fullName: data.fullName, grade: data.grade, roles: [] }
    });
  } catch (e) {
    return json(400, { error: e.message });
  }
};
