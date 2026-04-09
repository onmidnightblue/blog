module.exports = {
  theme: {
    extend: {
      keyframes: {
        "slide-up": {
          "0%": { transform: "translateY(10%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-up": "slide-up 0.2s ease-out",
      },
    },
  },
};
