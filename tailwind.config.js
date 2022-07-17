module.exports = {
  purge: {
    enable: process.env.NODE_ENV === 'production',
    content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    safelist: [],
  },
  darkMode: 'class',
  theme: {
    extend: {
      backgroundColor: theme => ({
        ...theme,
        'json-tool-yellow': '#ffe203',
        'json-tool-blue': '#62d4fd',
      }),
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  extend: {}
};
