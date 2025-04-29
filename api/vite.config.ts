import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [
    // Use the Node plugin for Express + tRPC
    VitePluginNode({
      adapter: "express",
      appPath: "./src/index.ts",
      exportName: "app",
      tsCompiler: "esbuild",
    }),
  ],
  build: {
    outDir: "dist",
    ssr: true,
    rollupOptions: {
      input: "./src/index.ts",
      external: ["express", "@trpc/server", "openai"], // don’t bundle deps
    },
  },
});
