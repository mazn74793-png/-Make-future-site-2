const { query } = require("./_db");
const { json, requireJWT } = require("./_auth");

exports.handler = async (event) => {
  try {
    const { uid } = requireJWT(event);
    const u = await query("select grade from users where id=$1", [uid]);
    if (u.rowCount === 0) return json(404, { error: "User not found" });
    const grade = u.rows[0].grade;

    const c = await query(
      `select c.id, c.title, c.teacher_name, c.subject, c.price_egp,
              coalesce(e.status,'locked') as status
       from courses c
       left join enrollments e on e.course_id=c.id and e.user_id=$1
       where c.grade=$2 and c.is_active=true
       order by c.id desc`,
      [uid, grade]
    );

    return json(200, { courses: c.rows });
  } catch (e) {
    return json(401, { error: e.message });
  }
};
