import { defineConfig } from "vite";

// Static site. Everything in /public is copied as-is to the build output.
// Build output folder for Cloudflare Pages: dist
export default defineConfig({
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
    assetsInlineLimit: 0,
  },
});
