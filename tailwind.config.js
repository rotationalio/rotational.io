module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Montserrat','Poppins', 'open-sans', 'sans-serif']
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};