import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  solid: {
    babel: {
      compact: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
