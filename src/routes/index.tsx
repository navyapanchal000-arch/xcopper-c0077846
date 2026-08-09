import { createFileRoute } from "@tanstack/react-router";
import ChatApp from "@/components/ChatApp";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "X COPPER – AI Assistant" },
      { name: "description", content: "X COPPER: a fast, beautiful AI assistant. Chat, voice, web search, and live mode." },
      { name: "google-site-verification", content: "fX_Y5D4ay6DYtR0kkUL4vL7PGjeGkr8Be2vFRaw3GvQ" },
    ],
  }),
});

function Index() {
  return <ChatApp />;
}
