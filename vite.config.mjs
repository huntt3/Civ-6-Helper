import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/Civ-6-Helper/", // Set base path for GitHub Pages deployment
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        districtDiscountingTool: resolve(
          __dirname,
          "districtDiscountingTool.html"
        ),
        eraScoreTracker: resolve(__dirname, "eraScoreTracker.html"),
        greatPeopleTracker: resolve(__dirname, "greatPeopleTracker.html"),
        hexPlanner: resolve(__dirname, "hexPlanner.html"),
        techsAndCivicsTree: resolve(__dirname, "techsAndCivicsTree.html"),
        wonderTracker: resolve(__dirname, "wonderTracker.html"),
      },
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
