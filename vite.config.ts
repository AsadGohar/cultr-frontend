import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import svgr from "vite-plugin-svgr";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [tailwindcss(), react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/assets": path.resolve(__dirname, "./src/assets"),
      "@/routes": path.resolve(__dirname, "./src/routes"),
      "@/layouts": path.resolve(__dirname, "./src/layouts"),
      "@/common": path.resolve(__dirname, "./src/common"),
      "@/mocks": path.resolve(__dirname, "./src/mocks"),
    },
  },
});
