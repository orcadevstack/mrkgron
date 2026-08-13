/** @type {import('tailwindcss').Config} */
const BLACK_SCALE = {
  50: "#000000", 100: "#000000", 200: "#000000", 300: "#000000", 400: "#000000",
  500: "#000000", 600: "#000000", 700: "#000000", 800: "#000000", 900: "#000000",
};

const ACCENT_SCALE = {
  50: "#EE6C4D", 100: "#EE6C4D", 200: "#EE6C4D", 300: "#EE6C4D", 400: "#EE6C4D",
  500: "#EE6C4D", 600: "#EE6C4D", 700: "#EE6C4D", 800: "#EE6C4D", 900: "#EE6C4D",
};

module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: BLACK_SCALE,
        slate: BLACK_SCALE,
        blue: BLACK_SCALE,
        indigo: BLACK_SCALE,
        cyan: BLACK_SCALE,
        amber: BLACK_SCALE,
        emerald: BLACK_SCALE,
        red: ACCENT_SCALE,
        brand: {
          navy:   "#000000",
          dark:   "#000000",
          blue:   "#000000",
          accent: "#EE6C4D",
          indigo: "#000000",
          gold:   "#EE6C4D",
          cyan:   "#000000",
          light:  "#FFFFFF",
        },
        enterprise: {
          navy: "#000000",
          blue: "#000000",
          gold: "#EE6C4D",
          slate: "#000000",
        },
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
        display: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
        mono: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease-out forwards",
        "fade-in":    "fadeIn 0.5s ease-out forwards",
        "slide-left": "slideLeft 0.6s ease-out forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "ticker":     "ticker 38s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideLeft: {
          "0%":   { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59,130,246,0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(59,130,246,0.6)" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
