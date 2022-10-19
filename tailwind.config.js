module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        MontSerrat: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern": "url('/img/hero.png')",
        "wave-pattern": "url('/img/wave.png')",
      },
      backgroundPosition: {
        'right-center': 'right center',
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};