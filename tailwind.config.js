/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.html', './public/js/**/*.js', './src/**/*.js'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
