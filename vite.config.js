import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
    server:{
        proxy: {
            "/nano-pdf": {
                target: "http://localhost:9091",
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/nano-pdf/, ""),
            }
        }
    },
    plugins: [react()],
});
