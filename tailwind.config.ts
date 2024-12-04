import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sand: {
          "100": "#F2EEC0",
          "200": "#c9c69f",
          "300": "#a19f7f",
          "400": "#7b7961",
          "500": "#585644",
          "600": "#363529",
          "700": "#181710",
        },
        sky: {
          "100": "#edeefb",
          "200": "#C0C4F2",
          "300": "#929ae9",
          "400": "#6372de",
          "500": "#384cbf",
          "600": "#212f7d",
          "700": "#0d1441",
        },
        stone: {
          "100": "#edece6",
          "200": "#c5c4be",
          "300": "#9e9d99",
          "400": "#797875",
          "500": "#565553",
          "600": "#353433",
          "700": "#171716",
        },
      },
      fontFamily: {
        sans: ["var(--font-roboto)", "sans-serif"],
        bokor: ["var(--font-bokor)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
