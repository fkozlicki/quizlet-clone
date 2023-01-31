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
        flipIn: {
          "0%": { transform: "rotateX(0deg)" },
          "100%": { transform: "rotateX(180deg)" },
        },
        flipOut: {
          "0%": { transform: "rotateX(180deg)" },
          "100%": { transform: "rotateX(360deg)" },
        },
        mismatch: {
          "0%": { background: "red" },
          "100%": { background: "white" },
        },
      },
      animation: {
        flipIn: "flipIn .25s ease-in-out 1",
        flipOut: "flipOut .25s ease-in-out 1",
        mismatch: "mismatch 1s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
