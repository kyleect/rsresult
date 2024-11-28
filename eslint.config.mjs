import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { files: ["src/**/*.{js,mjs,cjs,ts}"] },
  {
    rules: {
      // note you must disable the base rule
      // as it can report incorrect errors
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    ignores: ["dist/**/*.*"],
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
