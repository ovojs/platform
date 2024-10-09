import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/kup.ts"],
  format: ["cjs", "esm", "iife"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
});