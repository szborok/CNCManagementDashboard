import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    outDir: "dist",
  },
  server: {
    port: 3000,
    open: false, // start-all.js handles browser opening
    strictPort: true, // Exit if port is in use instead of trying another
    proxy: {
      '/api': {
        target: 'http://localhost:3004', // Dashboard backend
        changeOrigin: true,
      },
    },
  },
});
