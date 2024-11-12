/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{html,hbs,js}',  
    './templates/**/*.{html,hbs}',  // include templates if they’re outside the app folder (debugging)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

