import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Memastikan aset diproses dengan benar
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        // Mencegah masalah MIME type dengan struktur folder yang jelas
        manualChunks: undefined,
      },
    },
  },
});