import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  // ✅ Fix for otpauth + stale dependency cache
  optimizeDeps: {
    include: ["otpauth"],  // Force prebundling so Vite won’t mark it outdated
  },

  // ✅ Optional: ensure compatibility with browser-safe crypto
  define: {
    global: "window", // helps prevent Node 'crypto' polyfill issues
  },
}));
