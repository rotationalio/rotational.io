module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        MontSerrat: ["Montserrat", "sans-serif"],
      },
      colors: {
        'icon-hover': 'rgba(217, 217, 217, 0.4)',
      },
      typography(theme) {
        return {
          DEFAULT: {
            css: {
              "code::before": {
                content: "none",
              },
              "code::after": {
                content: "none",
              },
            },
          },
        };
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
