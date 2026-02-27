import React from "react";

export function Nav({ t, lang, setLang, theme, setTheme, session, setRoute, logout }) {
  const roles = session?.user?.roles || [];
  const isStaff = roles.includes("owner") || roles.includes("admin") || roles.includes("editor") || roles.includes("support");

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-white/70 dark:bg-zinc-950/70 border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between gap-3">
        <button onClick={() => setRoute(session ? "student" : "login")} className="font-semibold tracking-wide">
          {t.brand}
        </button>

        <div className="flex items-center gap-2">
          <button
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-sm"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            title={t.bilingual}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          <button
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={t.theme}
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {session ? (
            <>
              {isStaff && (
                <button
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-sm"
                  onClick={() => setRoute("admin")}
                >
                  {t.admin}
                </button>
              )}
              <button
                className="rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 px-3 py-1 text-sm"
                onClick={logout}
              >
                {t.logout}
              </button>
            </>
          ) : (
            <>
              <button className="rounded-lg px-3 py-1 text-sm" onClick={() => setRoute("login")}>{t.login}</button>
              <button className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1 text-sm" onClick={() => setRoute("register")}>{t.register}</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
