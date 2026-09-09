import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { AppShell } from "@/components/app-shell";
import appCss from "../styles.css?url";
import { asset } from "@/lib/asset";

const APP_NAME = "atelier";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      { name: "theme-color", content: "#F3EEE6" },
      {
        name: "description",
        content: "全身立绘素材馆 · 五百位养成角色，透明抠图，对白与场景工坊。",
      },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: asset("favicon.svg") },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  component: Root,
});

function Root() {
  const app = (
    <>
      <PreviewHostBridge />
      <AuthProvider>
        <AppShell>
          <Outlet />
        </AppShell>
      </AuthProvider>
    </>
  );

  if (import.meta.env.VITE_SPA === "1") {
    return <div className="antialiased">{app}</div>;
  }

  return (
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {app}
        <Scripts />
      </body>
    </html>
  );
}
