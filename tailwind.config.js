/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ["color-1"]: "hsla(var(--color-1))",
        ["color-2"]: "hsla(var(--color-2))",
        ["color-3"]: "hsla(var(--color-3))",
        ["background--1"]: "hsla(var(--background--1))",
        ["background-1"]: "hsla(var(--background-1))",
        ["background-2"]: "hsla(var(--background-2))",
        ["background-3"]: "hsla(var(--background-3))",
        ["icon-1"]: "hsla(var(--icon-1))",
        ["icon-2"]: "hsla(var(--icon-2))",
        ["shadow-1"]: "hsla(var(--shadow-1))",
        ["shadow-2"]: "hsla(var(--shadow-2))",
        ["color-danger"]: "hsla(var(--color-danger))",
        ["color-theme"]: "hsla(var(--color-theme))",
        ["color-placeholder"]: "hsla(var(--color-placeholder))",
        ["color-empty"]: "hsla(var(--color-empty))",
        ["color-fab"]: "hsla(var(--color-fab))",
        ["background-fab"]: "hsla(var(--background-fab))",
        ["background-modal"]: "hsla(var(--background-modal))",
      },
    },
  },
  plugins: [],
};
