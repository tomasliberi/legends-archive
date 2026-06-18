/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#d4af37",
        background: "#131313",
        surface: "#1c1b1b",
        "surface-dark": "#0e0e0e",
        "surface-card": "#201f1f",
        "on-surface": "#e5e2e1",
        "on-surface-variant": "#d0c5af",
        outline: "#4d4635",
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        body: ["Hanken Grotesk", "sans-serif"],
        label: ["Geist", "sans-serif"],
      },
    },
  },
  plugins: [],
};
