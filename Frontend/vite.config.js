import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    plugins: [react(), tailwindcss()],

    server: {
      proxy: {
        "/api": parseInt(process.env.BACKEND_URL),
      },
    },
  });
};
