import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.tsx"],
  format: ["cjs", "esm"],
  dts: true,
  minify: true,
  clean: true,
  external: ["react"],
  injectStyle: true, // This puts your CSS into the JS bundle
});