/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          50: "#f0f5ff",
          100: "#e0ebff",
          200: "#b9d2ff",
          300: "#8bb3ff",
          400: "#558bff",
          500: "#2d64ff",
          600: "#1e47e6",
          700: "#1a3bb8",
          800: "#1a3594",
          900: "#1e3a5f",
          950: "#0f1e3d",
        },
      },
      fontFamily: {
        sans: ['"PingFang SC"', '"Microsoft YaHei"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
