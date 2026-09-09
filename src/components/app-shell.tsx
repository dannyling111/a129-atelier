import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/cn";
import { useAtelier } from "@/lib/store";
import { useEffect } from "react";

const NAV = [
  { to: "/", label: "图鉴" },
  { to: "/studio", label: "工坊" },
  { to: "/bonds", label: "养成" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const toast = useAtelier((s) => s.toast);
  const clearToast = useAtelier((s) => s.clearToast);

  useEffect(() => {
    void useAtelier.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(clearToast, 2200);
    return () => window.clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div className="min-h-dvh bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-paper/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-serif text-xl tracking-tight">atelier</span>
            <span className="hidden text-[11px] tracking-[0.18em] text-muted sm:inline">
              立绘馆
            </span>
          </Link>
          <nav className="flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex h-10 items-center rounded-full px-3 text-sm transition-colors duration-150",
                    active ? "bg-ink text-paper" : "text-ink-soft hover:bg-paper-2",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">{children}</div>
      {toast ? (
        <div className="pointer-events-none fixed inset-x-0 bottom-6 z-40 flex justify-center px-4">
          <div className="rounded-full bg-ink px-4 py-2 text-sm text-paper shadow-[var(--shadow-border)]">
            {toast}
          </div>
        </div>
      ) : null}
    </div>
  );
}
