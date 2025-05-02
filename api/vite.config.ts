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
      external: ["express", "@trpc/server", "openai"],
    },
  },
});
