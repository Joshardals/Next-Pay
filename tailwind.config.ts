import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        snow: "#F9F9F9",
        goldenrod: "#E5C07B",
        charcoal: "#131313",
        lightGray: "#9A9A9A",
        darkGray: "#4C4C4C",
        darkCharcoal: "#262626",
      },

      fontFamily: {
        inter: ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
} satisfies Config;
