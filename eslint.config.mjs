import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The production build ships without the Next.js router (scripts/build-lean.mjs),
      // so internal links are plain <a> elements on purpose.
      "@next/next/no-html-link-for-pages": "off",
    },
  },
  globalIgnores([".next/**", "out/**", "preview/**", "next-env.d.ts", "assets/**"]),
]);
