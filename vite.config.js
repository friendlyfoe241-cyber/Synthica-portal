import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  // Build the React SPA from app.html → dist/
  build: {
    rollupOptions: {
      input: resolve(__dirname, "app.html"),
    },
    outDir: "dist",
  },
  // Public assets served at root during dev
  publicDir: "public",
});
