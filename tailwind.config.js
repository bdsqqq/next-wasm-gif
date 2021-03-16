const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      gray: colors.warmGray,
    },
    extend: {
      colors: {
        igor: {
          light: "#fffcf5",
          500: "#473539",
          700: "#2e2225",
        },
      },
    },
    fontFamily: {
      sans: ["Mplus", ...fontFamily.sans],
    },
  },
  variants: {
    extend: { opacity: ["disabled"] },
  },
  plugins: [],
};
