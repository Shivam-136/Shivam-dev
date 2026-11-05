import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { generatePrerenderHtml } from "./scripts/generatePrerenderHtml.js";

function prerenderCrawlerPlugin() {
  return {
    name: "vite-plugin-prerender-crawler",
    transformIndexHtml(html) {
      const prerendered = generatePrerenderHtml();
      return html.replace(
        /<div id="root">[\s\S]*?<\/div>/,
        `<div id="root">\n${prerendered}\n    </div>`
      );
    },
  };
}

export default defineConfig({
  plugins: [react(), prerenderCrawlerPlugin()],
  build: {
    target: "esnext",
    sourcemap: false,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap"],
          vendor: ["react", "react-dom"],
        },
      },
    },
  },
});
