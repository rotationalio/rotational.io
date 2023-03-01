module.exports = {
  content: ["content/**/*.md", "layouts/**/*.html"],
  theme: {
    extend: {
      fontFamily: {
        MontSerrat: ["Montserrat", "sans-serif"],
      },
      backgroundImage: {
        "hero-pattern": "url('/img/hero.png')",
        "hero-footer": "url('/img/foot.png')",
        "wave-pattern": "url('/img/wave.png')",
        "wavexl-pattern": "url('/img/wave_xl.png')",
        "wavelg-pattern": "url('/img/wave_lg.png')",
        hexagon: "url('/img/tileable-hexagon.png')",
        "transparent-overlay":
          "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent)",
      },
      backgroundPosition: {
        "right-center": "right center",
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
