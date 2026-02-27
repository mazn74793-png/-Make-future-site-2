import React, { useState } from "react";
import { api } from "../api";
import { GRADES } from "../i18n";

export function Register({ t, goLogin, onLogin }) {
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    phone: "",
    parentPhone: "",
    grade: "third_prep",
    password: ""
  });
  const [err, setErr] = useState("");

  function set(k, v) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await api("/auth_register", { method: "POST", body: form });
      onLogin(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h1 className="text-2xl font-semibold">{t.register}</h1>

      <form onSubmit={submit} className="mt-5 grid gap-3">
        <label className="grid gap-1">
          <span className="text-sm opacity-80">{t.fullName}</span>
          <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
            value={form.fullName} onChange={(e) => set("fullName", e.target.value)} required />
        </label>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">{t.username}</span>
          <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
            value={form.username} onChange={(e) => set("username", e.target.value)} required />
          <span className="text-xs opacity-70">{t.usernameHint}</span>
        </label>

        <div className="grid md:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm opacity-80">{t.phone}</span>
            <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
              value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
          </label>

          <label className="grid gap-1">
            <span className="text-sm opacity-80">{t.parentPhone}</span>
            <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
              value={form.parentPhone} onChange={(e) => set("parentPhone", e.target.value)} required />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">{t.grade}</span>
          <select className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
            value={form.grade} onChange={(e) => set("grade", e.target.value)}>
            {GRADES.map(g => (
              <option key={g.key} value={g.key}>
                {g.ar} / {g.en}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm opacity-80">{t.password}</span>
          <input type="password" className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
            value={form.password} onChange={(e) => set("password", e.target.value)} required />
        </label>

        {err && <div className="text-sm text-red-500">{err}</div>}

        <button className="rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 font-medium">
          {t.submit}
        </button>

        <button type="button" className="text-sm underline opacity-80 text-start" onClick={goLogin}>
          {t.login}
        </button>
      </form>
    </div>
  );
}
