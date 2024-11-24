import {nextui} from "@nextui-org/react";
import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography";

const tailwindConfig: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui(), typography()],
}

export default tailwindConfig;