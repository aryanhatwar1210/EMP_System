import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 5173,
    strictPort: false,
    proxy: { "/api": { target: "https://emp-system-backend-ndxg.onrender.com", changeOrigin: true } },
  },
});
