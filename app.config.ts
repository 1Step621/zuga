import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  server: {
    preset: "cloudflare-pages",
    rollupConfig: {
      external: ["node:async_hooks"],
    },
  },
  solid: {
    babel: {
      compact: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
