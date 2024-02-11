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
        shake: {
          "0%": { transform: "rotate(-2deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        slideLeft: {
          "0%": {
            transform: "perspective(1000px) rotateY(15deg) translateX(-60px)",
          },
          "100%": {
            transform: "perspective(1000px) rotateY(0deg) translateX(0px)",
          },
        },
        slideRight: {
          "0%": {
            transform: "perspective(1000px) rotateY(-15deg) translateX(60px)",
          },
          "100%": {
            transform: "perspective(1000px) rotateY(0deg) translateX(0px)",
          },
        },
        learning: {
          "0%": {
            opacity: 0,
            visibility: "hidden",
          },
          "25%": {
            opacity: 1,
            visibility: "visible",
            transform: "rotate(2deg)",
          },
          "75%": {
            opacity: 1,
            visibility: "visible",
            transform: "rotate(2deg)",
          },
          "100%": {
            opacity: 0,
            visibility: "hidden",
            transform: "rotate(0deg) translateX(-50px)",
          },
        },
        know: {
          "0%": {
            opacity: 0,
            visibility: "hidden",
          },
          "25%": {
            opacity: 1,
            visibility: "visible",
            transform: "rotate(-2deg)",
          },
          "75%": {
            opacity: 1,
            visibility: "visible",
            transform: "rotate(-2deg)",
          },
          "100%": {
            opacity: 0,
            visibility: "visible",
            transform: "rotate(0deg) translateX(50px)",
          },
        },
      },
      animation: {
        flipIn: "flipIn .25s ease-in-out 1",
        flipOut: "flipOut .25s ease-in-out 1",
        slideLeft: "slideLeft .15s linear 1",
        slideRight: "slideRight .15s linear 1",
        shake: "shake 100ms ease-in-out 3",
        learning: "learning .5s ease-in-out 1",
        know: "know .5s ease-in-out 1",
      },
    },
  },
  plugins: [],
  important: "#app",
};
