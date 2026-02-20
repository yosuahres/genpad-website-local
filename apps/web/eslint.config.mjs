import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import { fixupConfigRules } from "@eslint/compat";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  ...fixupConfigRules(
    compat.extends(
      "plugin:@next/next/core-web-vitals", 
      "plugin:@next/next/typescript"
    )
  ),

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
      // rules
    },
  },
];

export default eslintConfig;