import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/event.ts",
    "src/window.ts"
  ],
  format: ["esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  minify: true,
  clean: true,
  outExtension: (ctx) => ({ js: ".js", dts: ".d.ts" }),
});
