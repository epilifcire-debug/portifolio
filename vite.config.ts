import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carrega todas as variáveis (inclusive as não-VITE_) para o código de servidor.
const serverEnv = loadEnv(process.env["NODE_ENV"] ?? "development", process.cwd(), "");
Object.assign(process.env, serverEnv);

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "entities/decode": path.resolve(__dirname, "node_modules/entities/lib/decode.js"),
      "entities/encode": path.resolve(__dirname, "node_modules/entities/lib/encode.js"),
      "entities/lib/decode.js": path.resolve(__dirname, "node_modules/entities/lib/decode.js"),
      "entities/lib/encode.js": path.resolve(__dirname, "node_modules/entities/lib/encode.js"),
    },
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    tsConfigPaths(),
    tanstackStart({
      server: { entry: "server" },
    }),
    react(),
    tailwindcss(),
    // Build de produção como servidor Node (Docker na Shard Cloud), sem preset Cloudflare.
    nitro({
      preset: "node-server",
    }),
  ],
});
