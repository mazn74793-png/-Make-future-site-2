import React, { useMemo, useState } from "react";
import { storage } from "./storage";
import { dict } from "./i18n";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Student } from "./pages/Student";
import { Admin } from "./pages/Admin";
import { Nav } from "./components/Nav";

export function App() {
  const [lang, setLang] = useState(storage.get("lang", "ar"));
  const [theme, setTheme] = useState(storage.get("theme", "dark"));
  const [route, setRoute] = useState(storage.get("route", "login"));
  const [session, setSession] = useState(storage.get("session", null)); // {token, user}

  const t = useMemo(() => dict[lang], [lang]);

  React.useEffect(() => {
    storage.set("lang", lang);
    storage.set("theme", theme);
    storage.set("route", route);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [lang, theme, route]);

  function onLogin(newSession) {
    setSession(newSession);
    storage.set("session", newSession);
    setRoute("student");
  }

  function logout() {
    setSession(null);
    storage.del("session");
    setRoute("login");
  }

  return (
    <div className="min-h-screen">
      <Nav
        t={t}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        session={session}
        setRoute={setRoute}
        logout={logout}
      />

      <main className="mx-auto max-w-5xl px-4 py-8">
        {route === "login" && <Login t={t} onLogin={onLogin} goRegister={() => setRoute("register")} />}
        {route === "register" && <Register t={t} goLogin={() => setRoute("login")} onLogin={onLogin} />}
        {route === "student" && session && <Student t={t} session={session} setRoute={setRoute} />}
        {route === "admin" && session && <Admin t={t} session={session} />}
        {!session && (route === "student" || route === "admin") && (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
            {t.login} أولاً.
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6 text-center text-sm opacity-80">
        <div>قباء – جسر السويس</div>
        <div>01210575530 / 01006693681</div>
      </footer>
    </div>
  );
}
