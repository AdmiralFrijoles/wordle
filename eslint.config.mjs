import {defineConfig, globalIgnores} from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

export default defineConfig([
    ...nextVitals,
    ...nextTs,
    {
        // Existing code breaks these React Compiler rules. Raise them to errors once it is fixed.
        rules: {
            "react-hooks/set-state-in-effect": "warn",
            "react-hooks/immutability": "warn",
            "react-hooks/error-boundaries": "warn",
        },
    },
    globalIgnores([
        "**/*.min.{js,jsx,ts,tsx}",
        "**/.*cache/",
        ".github/",
        ".next/",
        ".vercel/",
        ".vscode/",
        "build/",
        "dist/",
        "public/",
        "src/components/ui/",
        "next-env.d.ts",
    ]),
]);
