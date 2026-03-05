import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  // ADDED: Use compat.extends to safely load the Next.js recommended rules in Flat Config
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "dist/**",
      ".turbo/**"
    ],
  },
  {
    rules: {
      // Turn off annoying React rules if you are using React 17+
      "react/react-in-jsx-scope": "off",
      "@next/next/no-html-link-for-pages": "off"
    },
  },
];

export default eslintConfig;