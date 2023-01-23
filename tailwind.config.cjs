/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        height: "height",
      },
      transitionTimingFunction: {
        borderHeight: "cubic-bezier(0.47, 0, 0.745, 0.715)",
      },
    },
  },
  plugins: [],
};
