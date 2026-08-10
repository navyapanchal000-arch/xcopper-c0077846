import { createFileRoute } from "@tanstack/react-router";
import ChatApp from "@/components/ChatApp";
if (typeof window !== 'undefined') {
  const existingManifest = document.querySelector("link[rel*='manifest']");
  if (!existingManifest) {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
  }
}
export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "X COPPER – AI Assistant" },
      { name: "description", content: "X COPPER: a fast, beautiful AI assistant. Chat, voice, web search, and live mode." },
      { name: "google-site-verification", content: "fx_YSO4ay6DYtR0kkUi4vL7PGjeGkrBBe2vFRaw3GvQ" },
    ],
  }),
});

function Index() {
  return <ChatApp />;
}
