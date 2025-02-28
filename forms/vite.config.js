import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.

  return {
    plugins: [vue()],
    base: '/forms/',  // Set base URL for production
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 80,
      host: "0.0.0.0",
      watch: {
        ignored: ["**/coverage/**"],
      },
    },
    preview: {
      port: 80,
    },
    // Handle PDF files and large JSON
    assetsInclude: ['**/*.pdf'],
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
        },
      },
    },
  };
});