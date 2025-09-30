/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ["layer-1"]: "hsla(var(--layer-1))",
        ["layer-2"]: "hsla(var(--layer-2))",
        ["layer-3"]: "hsla(var(--layer-3))",
        ["text-1"]: "hsla(var(--text-1))",
        ["text-2"]: "hsla(var(--text-2))",
        ["text-3"]: "hsla(var(--text-3))",
        ["text-4"]: "hsla(var(--text-4))",
        ["text-5"]: "hsla(var(--text-5))",
        ["theme"]: "hsla(var(--theme))",
        ["danger"]: "hsla(var(--danger))",
      },
    },
  },
  plugins: [],
};
