/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#0642f0",
          red: "#c63634",
          black: "#111111",
          gray: "#333333",
          light: "#f9f9f9",
          border: "#eaeaea"
        }
      },
      fontFamily: {
         outfit: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [ [require("tailwindcss-animate")]],
};

