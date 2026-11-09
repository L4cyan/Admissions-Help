import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#14203a",
        muted: "#66708a",
        paper: "#fffdf8",
        cream: "#f8f1e2",
        line: "#e7ddc8",
        navy: {
          50: "#eef3fb",
          100: "#d9e4f5",
          200: "#b6c9e8",
          300: "#8aa7d5",
          400: "#5b7fbd",
          500: "#3b60a0",
          600: "#294b85",
          700: "#1c3a6d",
          800: "#142c56",
          900: "#0b1f4a",
          950: "#071632",
        },
        gold: {
          50: "#fdf8e8",
          100: "#f9edc4",
          200: "#f3dc8e",
          300: "#eac455",
          400: "#dfa92b",
          500: "#c98c17",
          600: "#a86b11",
          700: "#864f12",
          800: "#703f16",
          900: "#603616",
        },
        sky: {
          100: "#e8f3fa",
          200: "#cfe7f4",
          300: "#a9d3e9",
          400: "#79b8d8",
          500: "#5098be",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      boxShadow: {
        soft: "0 18px 50px -22px rgba(20, 32, 58, 0.28)",
        card: "0 10px 30px -16px rgba(20, 32, 58, 0.22)",
        glow: "0 0 0 1px rgba(223, 169, 43, 0.22), 0 18px 45px -20px rgba(223, 169, 43, 0.45)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        bob: {
          "0%, 100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-4px) rotate(1deg)" },
        },
        pop: {
          "0%": { opacity: "0", transform: "translateY(8px) scale(.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        blink: {
          "0%, 92%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(.08)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "100% 50%" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        bob: "bob 3.2s ease-in-out infinite",
        pop: "pop .35s cubic-bezier(.2,.9,.3,1.2) both",
        blink: "blink 4.5s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
        wiggle: "wiggle 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
