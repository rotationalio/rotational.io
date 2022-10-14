module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        MontSerrat: ["Montserrat", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};