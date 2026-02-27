const { query } = require("./_db");
const { json, requireJWT } = require("./_auth");

async function rolesOf(uid) {
  const r = await query(
    `select roles.name from user_roles join roles on roles.id=user_roles.role_id where user_roles.user_id=$1`,
    [uid]
  );
  return r.rows.map(x => x.name);
}
function isStaff(roles) {
  return roles.includes("owner") || roles.includes("admin") || roles.includes("editor") || roles.includes("support");
}

exports.handler = async (event) => {
  try {
    const { uid } = requireJWT(event);
    const myRoles = await rolesOf(uid);
    if (!isStaff(myRoles)) return json(403, { error: "Forbidden" });

    const u = await query(
      `select id, username, phone, full_name, grade, created_at from users order by id desc limit 200`
    );

    // attach roles
    const ids = u.rows.map(x => x.id);
    let map = {};
    if (ids.length) {
      const rr = await query(
        `select ur.user_id, r.name from user_roles ur join roles r on r.id=ur.role_id where ur.user_id = any($1)`,
        [ids]
      );
      for (const row of rr.rows) {
        map[row.user_id] = map[row.user_id] || [];
        map[row.user_id].push(row.name);
      }
    }

    const users = u.rows.map(x => ({
      id: x.id,
      username: x.username,
      phone: x.phone,
      full_name: x.full_name,
      grade: x.grade,
      roles: map[x.id] || []
    }));

    return json(200, { users });
  } catch (e) {
    return json(401, { error: e.message });
  }
};
