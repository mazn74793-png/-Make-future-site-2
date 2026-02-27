import React, { useEffect, useState } from "react";
import { api } from "../api";

export function Admin({ t, session }) {
  const token = session.token;
  const roles = session.user.roles || [];
  const isStaff = roles.includes("owner") || roles.includes("admin") || roles.includes("editor") || roles.includes("support");

  const [users, setUsers] = useState([]);
  const [payments, setPayments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [tempPassMsg, setTempPassMsg] = useState("");
  const [err, setErr] = useState("");

  async function refresh() {
    setErr("");
    try {
      const u = await api("/admin_users", { token });
      const p = await api("/admin_payments", { token });
      const c = await api("/admin_courses", { token });
      setUsers(u.users);
      setPayments(p.payments);
      setCourses(c.courses);
    } catch (e) {
      setErr(e.message);
    }
  }

  useEffect(() => { if (isStaff) refresh(); }, []);

  async function resetPassword(userId) {
    setTempPassMsg(""); setErr("");
    try {
      const r = await api("/admin_reset_password", { method: "POST", token, body: { userId } });
      setTempPassMsg(`Temp password for user #${userId}: ${r.tempPassword}`);
    } catch (e) {
      setErr(e.message);
    }
  }

  async function approvePayment(paymentId) {
    setErr("");
    try {
      await api("/admin_payments", { method: "POST", token, body: { action: "approve", paymentId } });
      await refresh();
    } catch (e) {
      setErr(e.message);
    }
  }

  async function seedDemo() {
    setErr("");
    try {
      await api("/admin_courses", { method: "POST", token, body: { action: "seed_demo" } });
      await refresh();
    } catch (e) {
      setErr(e.message);
    }
  }

  if (!isStaff) {
    return (
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        Access denied.
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h2 className="text-xl font-semibold">{t.admin}</h2>
        <div className="text-sm opacity-80 mt-1">Roles: {roles.join(", ")}</div>

        <div className="mt-4 flex gap-2">
          <button className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm" onClick={refresh}>
            Refresh
          </button>
          <button className="rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 text-sm" onClick={seedDemo}>
            Seed demo courses
          </button>
        </div>

        {err && <div className="text-sm text-red-500 mt-3">{err}</div>}
        {tempPassMsg && <div className="text-sm text-green-500 mt-3">{tempPassMsg}</div>}
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold">Payment Requests</h3>
        <div className="mt-3 grid gap-2">
          {payments.map(p => (
            <div key={p.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="font-medium">#{p.id} — {p.status}</div>
              <div className="text-sm opacity-80">
                Student: {p.full_name} ({p.phone}) — Course: {p.course_title}
              </div>
              <div className="text-sm opacity-80">Method: {p.method} — Ref: {p.reference || "-"}</div>
              {p.status === "pending" && (
                <button
                  className="mt-2 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-3 py-1 text-sm"
                  onClick={() => approvePayment(p.id)}
                >
                  Approve
                </button>
              )}
            </div>
          ))}
          {payments.length === 0 && <div className="text-sm opacity-80">No payments yet.</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold">Users</h3>
        <div className="mt-3 grid gap-2">
          {users.map(u => (
            <div key={u.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 flex items-center justify-between gap-2">
              <div>
                <div className="font-medium">#{u.id} — {u.full_name}</div>
                <div className="text-sm opacity-80">@{u.username} — {u.phone} — {u.grade}</div>
                <div className="text-sm opacity-80">Roles: {(u.roles || []).join(", ") || "student"}</div>
              </div>
              <button
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-sm"
                onClick={() => resetPassword(u.id)}
              >
                Reset Password
              </button>
            </div>
          ))}
          {users.length === 0 && <div className="text-sm opacity-80">No users yet.</div>}
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <h3 className="text-lg font-semibold">Courses</h3>
        <div className="mt-3 grid gap-2">
          {courses.map(c => (
            <div key={c.id} className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
              <div className="font-medium">{c.title}</div>
              <div className="text-sm opacity-80">{c.grade} — {c.subject} — {c.teacher_name} — {c.price_egp} EGP</div>
            </div>
          ))}
          {courses.length === 0 && <div className="text-sm opacity-80">No courses yet. Click seed.</div>}
        </div>
      </div>
    </div>
  );
}
