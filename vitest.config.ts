import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    watch: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["**/*.test.ts", "**/*.test.tsx", "src/index.tsx"],
      reporter: ["text", "json", "html"],
    },
  },
});

