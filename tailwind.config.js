/** @type {import('tailwindcss').Config} */
const { heroui } = require("@heroui/react");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#7c3aed", // Violet-600 from Tailwind
          light: "#f5f3ff",   // Violet-50
          dark: "#4c1d95",    // Violet-900
        },
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
