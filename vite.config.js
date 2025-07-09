import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/Civ-6-Helper/", // Set base path for GitHub Pages deployment
  test: {
    globals: true,
    environment: "jsdom",
  },
});
