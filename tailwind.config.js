/** @type {import('tailwindcss').Config} */
module.exports = {
 content: ['./public/**/*.html', './src/js/*.js'],
 theme: {
  extend: {},
 },
 plugins: [require(`@tailwindcss/forms`)],
};
