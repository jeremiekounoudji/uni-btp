import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        main: "#1A4256",
        primary: "#1A1A1A",
        secondary: "#F5F5F5",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

export default config; 