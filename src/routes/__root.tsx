import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { AlertHost } from "@/components/AlertPopup";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "X COPPER--Navya panchal" },
      { name: "description", content: "X COPPER — MADE BY NAVYA PANCHAL" },
      { name: "author", content: "Lovable" },
      { name: "google-site-verification", content: "fx_YSO4ay6DYtR0kkUi4vL7PGjeGkrBBe2vFRaw3GvQ" },
      { property: "og:title", content: "X COPPER--Navya panchal" },
      { property: "og:description", content: "X COPPER — MADE BY NAVYA PANCHAL" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
      { name: "twitter:title", content: "X COPPER--Navya panchal" },
      { name: "twitter:description", content: "X COPPER — MADE BY NAVYA PANCHAL" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3d49f1cb-4e59-43ed-b170-1827f7eec81d/id-preview-3877a50e--544d7402-113d-4002-b784-5aa37125fb7d.lovable.app-1777970537229.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3d49f1cb-4e59-43ed-b170-1827f7eec81d/id-preview-3877a50e--544d7402-113d-4002-b784-5aa37125fb7d.lovable.app-1777970537229.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Toaster />
        <AlertHost />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
