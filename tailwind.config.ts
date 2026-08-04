import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#090909",
        panel: "#151515",
        panel2: "#1b1b1b",
        line: "rgba(255,255,255,0.08)",
        purple: "#7C4DFF",
        pink: "#FF4DA6",
        dim: "rgba(255,255,255,0.45)",
        emerald: "#2ECC8F",
        warn: "#FFA53E",
        danger: "#FF5C5C",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #7C4DFF, #FF4DA6)",
      },
    },
  },
  plugins: [],
};

export default config;
