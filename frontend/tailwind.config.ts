import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#06131d",
        ocean: "#0b2535",
        surf: "#c7f0ff",
        mint: "#8ff0c8",
        sand: "#f4ead5",
        sunrise: "#ffb36b",
        danger: "#ff7a7a",
      },
      boxShadow: {
        glow: "0 18px 60px rgba(9, 28, 39, 0.20)",
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
      },
      fontFamily: {
        sans: ["Segoe UI Variable", "Aptos", "Inter", "sans-serif"],
        display: ["Bahnschrift", "Segoe UI Variable", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
