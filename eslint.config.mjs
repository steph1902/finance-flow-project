import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    files: ["src/components/layout/ThemeToggle.tsx"],
    rules: {
      // This component uses the recommended pattern from next-themes documentation
      // for SSR hydration, which requires setState in useEffect
      "react-hooks/set-state-in-effect": "off",
    },
  },
  {
    files: ["src/components/transactions/TransactionForm.tsx"],
    rules: {
      // React Hook Form's watch() API is intentionally not memoizable
      // This is expected behavior and documented in React Hook Form
      "react-hooks/incompatible-library": "warn",
    },
  },
]);

export default eslintConfig;
