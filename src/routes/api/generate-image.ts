import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { prompt } = (await request.json()) as { prompt: string };
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response(JSON.stringify({ error: "Image service unavailable" }), { status: 500 });

        const upstream = await fetch("https://ai.gateway.lovable.dev/v1/images/generations", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "google/gemini-3.1-flash-image",
            messages: [
              {
                role: "user",
                content: `Generate a high quality image exactly matching this request, no text overlays unless asked: ${prompt}`,
              },
            ],
            modalities: ["image", "text"],
          }),
        });

        const text = await upstream.text();
        if (!upstream.ok) {
          console.error(`Image gen failed [${upstream.status}]: ${text}`);
          return new Response(JSON.stringify({ error: text }), { status: upstream.status });
        }
        let b64: string | undefined;
        try { b64 = JSON.parse(text)?.data?.[0]?.b64_json; } catch {}
        if (!b64) return new Response(JSON.stringify({ error: "No image returned" }), { status: 502 });
        return new Response(JSON.stringify({ image: `data:image/png;base64,${b64}` }), {
          headers: { "Content-Type": "application/json" },
        });
      },
    },
  },
});
