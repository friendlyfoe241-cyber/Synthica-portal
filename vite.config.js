import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// __dirname equivalent for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "app.html"),
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  publicDir: "public",
});
