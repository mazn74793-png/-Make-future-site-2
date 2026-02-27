const { query } = require("./_db");
const { json, requireJWT } = require("./_auth");

exports.handler = async (event) => {
  try {
    const { uid } = requireJWT(event);

    const v = await query(
      `select cv.id, cv.title, cv.youtube_url, c.title as course_title
       from course_videos cv
       join courses c on c.id=cv.course_id
       join enrollments e on e.course_id=c.id and e.user_id=$1 and e.status='active'
       where cv.is_active=true
       order by c.id desc, cv.sort_order asc, cv.id asc`,
      [uid]
    );

    return json(200, { videos: v.rows });
  } catch (e) {
    return json(401, { error: e.message });
  }
};
