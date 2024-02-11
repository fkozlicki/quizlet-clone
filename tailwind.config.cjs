/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
        heightWidth: "height, width",
      },
      transitionTimingFunction: {
        borderHeight: "cubic-bezier(0.47, 0, 0.745, 0.715)",
      },
      keyframes: {
        shake: {
          "0%": { transform: "rotate(-2deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        shake: "shake 100ms ease-in-out 3",
      },
    },
  },
  plugins: [],
  important: "#app",
};
