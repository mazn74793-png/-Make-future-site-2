import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/-Make-future-site-2/",
  plugins: [react()],
  server: { port: 5173 },
});
