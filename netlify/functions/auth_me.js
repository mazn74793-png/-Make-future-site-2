const { query } = require("./_db");
const { json, requireJWT } = require("./_auth");

async function getRoles(uid) {
  const r = await query(
    `select roles.name
     from user_roles join roles on roles.id=user_roles.role_id
     where user_roles.user_id=$1`,
    [uid]
  );
  return r.rows.map(x => x.name);
}

exports.handler = async (event) => {
  try {
    const { uid } = requireJWT(event);
    const u = await query("select id, username, phone, full_name, grade from users where id=$1", [uid]);
    if (u.rowCount === 0) return json(404, { error: "User not found" });
    const roles = await getRoles(uid);

    return json(200, {
      user: {
        id: uid,
        username: u.rows[0].username,
        phone: u.rows[0].phone,
        fullName: u.rows[0].full_name,
        grade: u.rows[0].grade,
        roles
      }
    });
  } catch (e) {
    return json(401, { error: e.message });
  }
};
