import type { Config } from "tailwindcss";

const config = {
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
    extend: { colors: {
        white: "#FFFFFF",
        navy: "#072446",
        black: "#000000",
        grey: {
          100: "#E0E0E0",
          300: "#B7B7B7",
          500: "#585858"
        },
        green: {
          100: "#DBFFE1",
          500: "#78C142",
        },
        orange: {
          100: "#FFF6D0",
          500: "#FF8800",
        },
        red: {
          100: "#FFF0F0",
          500: "#FA646A"
        },
        blue: {
          500: "#1B9DDF"
        },
        yellow: {
          500: "#FAB900"
        }
      },
      fontFamily: {
        heading: ["Hanken Grotesk", "sans-serif"],
        sans: ["Inter", "sans-serif"]
      },
      // borderRadius: {
      //   lg: "var(--radius)",
      //   md: "calc(var(--radius) - 2px)",
      //   sm: "calc(var(--radius) - 4px)",
      // },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
