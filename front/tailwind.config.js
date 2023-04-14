/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        "coffee-light": {
          DEFAULT: "#CCAE83",
          50: "#FFFFFF",
          100: "#FCFAF7",
          200: "#F0E7DA",
          300: "#E4D4BD",
          400: "#D8C1A0",
          500: "#CCAE83",
          600: "#BC945B",
          700: "#9E7841",
          800: "#765A31",
          900: "#4E3B20",
          950: "#3A2C18",
        },
      },
    },
  },
  plugins: [],
};
