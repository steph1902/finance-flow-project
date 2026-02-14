import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Prevent console statements in production code
      "no-console": "error",
      // Prefer unknown over any for better type safety
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

const loadTestConfig = {
  files: ["tests/load/**/*.js"],
  rules: {
    "no-console": "off",
    "import/no-anonymous-default-export": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
};

export default [...eslintConfig, loadTestConfig];
