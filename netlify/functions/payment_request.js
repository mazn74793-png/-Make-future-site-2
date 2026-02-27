const { z } = require("zod");
const { query } = require("./_db");
const { json, requireJWT } = require("./_auth");

const schema = z.object({
  courseId: z.number().int().positive(),
  method: z.enum(["vodafone_cash","instapay"]),
  reference: z.string().max(100).optional()
});

exports.handler = async (event) => {
  try {
    const { uid } = requireJWT(event);
    if (event.httpMethod !== "POST") return json(405, { error: "Method not allowed" });

    const body = JSON.parse(event.body || "{}");
    const data = schema.parse(body);

    // create enrollment if not exists, set pending
    await query(
      `insert into enrollments(user_id, course_id, status)
       values($1,$2,'pending')
       on conflict(user_id, course_id) do update set status='pending'`,
      [uid, data.courseId]
    );

    await query(
      `insert into payment_requests(user_id, course_id, method, reference, status)
       values($1,$2,$3,$4,'pending')`,
      [uid, data.courseId, data.method, data.reference || null]
    );

    return json(200, { ok: true });
  } catch (e) {
    return json(400, { error: e.message });
  }
};
