import React, { useState } from "react";
import { api } from "../api";
import { motion } from "framer-motion";

export function Login({ t, onLogin, goRegister }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  async function submit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await api("/auth_login", { method: "POST", body: { identifier, password } });
      onLogin(data);
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="grid gap-6">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6"
      >
        <h1 className="text-2xl font-semibold">{t.login}</h1>
        <p className="opacity-80 mt-1">
          Premium scroll animations موجودة في الصفحة الرئيسية بعدين، دلوقتي MVP للوجين.
        </p>

        <form onSubmit={submit} className="mt-5 grid gap-3">
          <label className="grid gap-1">
            <span className="text-sm opacity-80">Username أو رقم الموبايل</span>
            <input className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
              value={identifier} onChange={(e) => setIdentifier(e.target.value)} required />
          </label>

          <label className="grid gap-1">
            <span className="text-sm opacity-80">{t.password}</span>
            <input type="password" className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent px-3 py-2"
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>

          {err && <div className="text-sm text-red-500">{err}</div>}

          <button className="rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-4 py-2 font-medium">
            {t.submit}
          </button>

          <button type="button" className="text-sm underline opacity-80 text-start" onClick={goRegister}>
            {t.register}
          </button>

          <details className="mt-2">
            <summary className="cursor-pointer text-sm underline opacity-80">{t.forgot}</summary>
            <p className="text-sm opacity-80 mt-2">{t.forgotMsg}</p>
          </details>
        </form>
      </motion.div>
    </div>
  );
}
