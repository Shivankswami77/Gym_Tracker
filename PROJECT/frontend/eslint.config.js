import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      strict: false, // Disables all strict type checks
      noImplicitAny: false, // Allows the use of 'any'
      skipLibCheck: true, // Skips type checking of declaration files
      allowJs: true, // Allows JavaScript files
      noEmit: true, // Prevents emitting compiled JavaScript files
    },
  }
);
