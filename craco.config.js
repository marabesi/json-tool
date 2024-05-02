module.exports = {
  style: {
    postcss: {
      plugins: (plugins) => [
        require('tailwindcss'),
        require('autoprefixer'),
      ].concat(plugins),
    },
  },
  babel: {
    plugins: ['preval']
  }
};
