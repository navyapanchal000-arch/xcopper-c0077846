import { createFileRoute } from "@tanstack/react-router";
import ChatApp from "@/components/ChatApp";

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
