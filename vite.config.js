import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    // After build: rename app.html → index.html so Vercel serves it correctly
    {
      name: "rename-app-to-index",
      closeBundle() {
        const src = resolve(__dirname, "dist/app.html");
        const dest = resolve(__dirname, "dist/index.html");
        if (fs.existsSync(src)) {
          fs.renameSync(src, dest);
          console.log("✓ Renamed dist/app.html → dist/index.html");
        }
      },
    },
  ],
  build: {
    rollupOptions: {
      input: resolve(__dirname, "app.html"),
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  publicDir: "public",
});
