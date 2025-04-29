// eslint.config.js (flat‐config)
import js from "@eslint/js";
import ts from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import prettier from "eslint-config-prettier";

export default [
  // 1) Base JS rules
  js.configs.recommended,

  // 2) Base TS rules
  ...ts.configs.recommended,

  // 3) All TS/TSX: common parser & rules
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: ts.parser,
      parserOptions: { project: "./tsconfig.json" },
    },
    plugins: {
      "@typescript-eslint": ts.plugin,
      react,
      "react-hooks": reactHooks,
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // 4) API code
  {
    files: ["api/**/*.{ts,tsx}", "api/vite.config.ts"],
    languageOptions: {
      parserOptions: { project: "api/tsconfig.json" },
    },
  },

  // 5) UI code
  {
    files: ["ui/**/*.{ts,tsx}", "ui/vite.config.ts", "ui/main.tsx"],
    languageOptions: {
      parserOptions: { project: "ui/tsconfig.json" },
    },
  },

  // 6) Shared utils
  {
    files: ["shared/utils/**/*.ts"],
    languageOptions: {
      parserOptions: { project: "shared/utils/tsconfig.json" },
    },
  },

  // 7) Shared trpc
  {
    files: ["shared/trpc/**/*.ts"],
    languageOptions: {
      parserOptions: { project: "shared/trpc/tsconfig.json" },
    },
  },

  // 8) Always run Prettier last
  prettier,
];
