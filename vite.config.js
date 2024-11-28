// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve("src/index.ts"),
      name: "index",
      fileName: "index",
    },
    sourcemap: true,
    rollupOptions: {
      external: (value) => value.includes(".test."),
    },
  },
  plugins: [dts()],
});
