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
      input: {
        main: resolve(__dirname, "app.html"),
        'AssociateResearcherCertGen-generator': resolve(__dirname, "AssociateResearcherCertGen/generator.html"),
        'LeadResearchCertGen-generator': resolve(__dirname, "LeadResearchCertGen/generator.html"),
        'ChapterLeaderCertGen-generator': resolve(__dirname, "ChapterLeaderCertGen/generator.html"),
        'IndependentResearcherCertGen-generator': resolve(__dirname, "IndependentResearcherCertGen/generator.html"),
      },
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  publicDir: "public",
});
