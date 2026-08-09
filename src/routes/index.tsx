import { createFileRoute } from "@tanstack/react-router";
import ChatApp from "@/components/ChatApp";
document.title = "xcopper";
let meta = document.createElement('meta');
meta.name = "google-site-verification";
meta.content = "<meta name="google-site-verification" content="fx_YSO4ay6DYtR0kkUi4vL7PGjeGkrBBe2vFRaw3GvQ" />";
document.head.appendChild(meta);

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "X COPPER — AI Assistant" },
      { name: "description", content: "X COPPER: a fast, beautiful AI assistant. Chat, voice, web search, and live mode." },
    ],
  }),
});

function Index() {
  return <ChatApp />;
}
