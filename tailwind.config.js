module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        MontSerrat: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern": "url('/img/hero.png')",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};