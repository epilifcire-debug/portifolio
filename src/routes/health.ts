import { createFileRoute } from "@tanstack/react-router";

// Health check leve para a Shard Cloud: não consulta o banco nem APIs externas.
export const Route = createFileRoute("/health")({
  server: {
    handlers: {
      GET: () =>
        Response.json(
          { status: "ok" },
          { headers: { "Cache-Control": "no-store" } },
        ),
    },
  },
});
