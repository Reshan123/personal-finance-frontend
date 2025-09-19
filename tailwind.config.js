const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...fontFamily.sans],
      },
    },
  },
  // ...
};