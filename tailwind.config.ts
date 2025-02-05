import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "rgb(30, 41, 59)", // slate-800
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "rgb(250, 204, 21)", // yellow-400
          foreground: "rgb(30, 41, 59)", // slate-800
        },
        accent: {
          DEFAULT: "rgb(250, 204, 21)", // yellow-400
          foreground: "rgb(30, 41, 59)", // slate-800
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 2px 10px rgba(0, 0, 0, 0.05)",
      },
      maxWidth: {
        "layout": "1152px", // max-w-6xl equivalent
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        'scroll': 'scroll 30s linear infinite'
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;