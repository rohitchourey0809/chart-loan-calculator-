/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enable dark mode using class-based toggling
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Helvetica", "Arial", "sans-serif"], // Set Roboto as the default font family
      },
      colors: {
        "custom-color-1": "#e34731",
      },
    },
  },
  plugins: [],
};
