import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#0f172a",
          foreground: "#f8fafc",
        },
        accent: {
          DEFAULT: "#f59e0b",
          foreground: "#78350f",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
