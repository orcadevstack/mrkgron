/** @type {import('tailwindcss').Config} */
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
        primary: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
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
        // Enterprise palette
        enterprise: {
          navy:  "#0A1A2F",
          blue:  "#1F6FEB",
          gold:  "#F5C542",
          slate: "#2E3A45",
        },
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
        display: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
        mono: ["Inter", "SF Pro Display", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0A1628 0%, #1E3A8A 50%, #0F172A 100%)",
        "card-gradient":
          "linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(79,70,229,0.08) 100%)",
        "accent-gradient":
          "linear-gradient(90deg, #3B82F6 0%, #06B6D4 100%)",
        "gold-gradient":
          "linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)",
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
