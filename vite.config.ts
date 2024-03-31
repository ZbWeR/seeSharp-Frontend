import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  envDir: "./.env",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
