import React, { useEffect, useMemo, useState } from "react";
import { api } from "../api";

export function Student({ t, session, setRoute }) {
  const token = session.token;
  const [courses, setCourses] = useState([]);
  const [videos, setVideos] = useState([]);
  const [method, setMethod] = useState("vodafone_cash");
  const [courseId, setCourseId] = useState("");
  const [reference, setReference] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const supportWhats = useMemo(() => (import.meta.env.VITE_SUPPORT_WHATSAPP || "201210575530"), []);

  useEffect(() => {
    (async () => {
      const c = await api("/courses_public", { token });
      setCourses(c.courses);
    })().catch(() => {});
  }, [token]);

  async function loadVideos() {
    setErr(""); setMsg("");
    try {
      const v = await api("/student_videos", { token });
      setVideos(v.videos);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function sendPayment(e) {
    e.preventDefault();
    setErr(""); setMsg("");
    try {
      await api("/payment_request", {
        method: "POST",
        token,
        body: { courseId: Number(courseId), method, reference }
      });
      setMsg("تم إرسال طلب الدفع. انتظر تأكيد الأدمن.");
    } catch (e) {
      setErr(e.message);
    }
  }

  const whatsappLink = `https://wa.me/${supportWhats}?text=${encodeURIComponent("عندي مشكلة في الدفع - Make Future")}`;

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-semibold">{t.dashboard}</h2>
          <button className="text-sm underline opacity-80" onClick={() => setRoute("admin")}>
            {t.admin}
          </button>
        </div>
        <div className="mt-2 opacity-80 text-sm">
          {session.user.fullName} — {session.user.grade}
        </div>

        <div className="mt-5 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="font-medium">{t.courses}</div>
            <div className="mt-3 grid gap-2">
              {courses.map((c) => (
                <div key={c.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
                  <div className="font-medium">{c.title}</div>
                  <div className="text-sm opacity-80">{c.subject.toUpperCase()} — {c.teacher_name}</div>
                  <div className="text-sm opacity-80">{t.status}: {c.status === "active" ? t.active : c.status === "pending" ? t.pending : t.locked}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            <div className="font-medium">{t.paymentTitle}</div>
            <div className="text-sm opacity-80 mt-1">{t.paymentNumber}: <b>01210575530</b></div>

            <form className="mt-3 grid gap-2" onSubmit={sendPayment}>
              <label className="grid gap-1">
                <span className="text-sm opacity-80">Course</span>
                <select className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
                  value={courseId} onChange={(e) => setCourseId(e.target.value)} required>
                  <option value="" disabled>اختر كورس</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-sm opacity-80">Method</span>
                <select className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
                  value={method} onChange={(e) => setMethod(e.target.value)}>
                  <option value="vodafone_cash">{t.vodafone}</option>
                  <option value="instapay">{t.instapay}</option>
                </select>
              </label>

              <label className="grid gap-1">
                <span className="text-sm opacity-80">{t.reference}</span>
                <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
                  value={reference} onChange={(e) => setReference(e.target.value)} />
              </label>

              {err && <div className="text-sm text-red-500">{err}</div>}
              {msg && <div className="text-sm text-green-500">{msg}</div>}

              <button className="rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 font-medium">
                {t.sendPay}
              </button>

              <a className="text-sm underline opacity-80" href={whatsappLink} target="_blank" rel="noreferrer">
                {t.openWhatsapp}
              </a>
            </form>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{t.videos}</h3>
          <button className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-sm" onClick={loadVideos}>
            Refresh
          </button>
        </div>

        <div className="mt-4 grid gap-2">
          {videos.length === 0 ? (
            <div className="opacity-80 text-sm">
              اضغط Refresh. الفيديوهات بتظهر بعد ما الأدمن يفتح الكورس لك (Active).
            </div>
          ) : videos.map(v => (
            <a key={v.id} href={v.youtube_url} target="_blank" rel="noreferrer"
              className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 hover:opacity-90">
              <div className="font-medium">{v.title}</div>
              <div className="text-sm opacity-80">{v.course_title}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
