import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FBF9F4",
        ink: "#1B1B1F",
        ink2: "#4A4A52",
        hairline: "#E4E0D6",
        forest: {
          DEFAULT: "#1F5C4F",
          dark: "#153F37",
          light: "#2C7A69",
        },
        gold: {
          DEFAULT: "#C9A15A",
          light: "#E4CE9C",
        },
        clay: "#B5533C",
      },
      fontFamily: {
        display: ["'Fraunces'", "Georgia", "serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      maxWidth: {
        prose: "72ch",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(27,27,31,0.04), 0 8px 24px rgba(27,27,31,0.06)",
        glass: "0 1px 1px rgba(27,27,31,0.03), 0 12px 32px rgba(27,27,31,0.08)",
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

export default config;
