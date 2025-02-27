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
        },
        gradient: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        glow: {
          '0%, 100%': {
            'box-shadow': '0 0 20px 2px rgba(255, 255, 255, 0.3)',
            opacity: '1'
          },
          '50%': {
            'box-shadow': '0 0 30px 4px rgba(255, 255, 255, 0.5)',
            opacity: '0.8'
          },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'scroll': 'scroll 30s linear infinite',
        'gradient-x': 'gradient 15s ease infinite',
        'pulse-glow': 'glow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-delay': 'fadeIn 0.5s ease-out 0.2s',
        'fade-in-delay-2': 'fadeIn 0.5s ease-out 0.4s',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;