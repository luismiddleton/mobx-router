import { pluginReact } from "@rsbuild/plugin-react";
import { defineConfig } from "@rslib/core";

export default defineConfig({
  source: {
    entry: {
      index: ["./src/index.ts"],
    },
    exclude: ["./src/**.test.ts", "./src/**/*.spec.ts"],
  },
  lib: [
    {
      dts: true,
      format: "esm",
    },
  ],
  output: {
    target: "web",
  },
  plugins: [pluginReact()],
});
