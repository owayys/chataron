/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs}", "./resources/**/*.{html,js}"],
  theme: {
    screens: {
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1280px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'md-m': {'min': '1281px'},

      'sm': {'max': '400px'},
      // => @media (max-width: 639px) { ... }
    },
    fontFamily: {
      'newFont': ['Poppins', 'sans-serif'],
    },
    minHeight: {
      'screen': '100vh',
      '11/12': '91.66%'
    },
    maxHeight: {
      'screen': '100vh',
      '11/12': '91.66vh',
      '5/6': '83.33vh',
      '2/3': '66.66vh',
      '80': '80vh',
      '82': '82vh',
      '70': '70vh',
      '78': '78vh'
    },
    extend: {
      margin: {
        '76': '19rem',
      },
      colors: {
        'dark-porp': '#4E426D',
        'light-porp': '#5C4F81',
        'text-porp': '#c5bfd8',
        'orang': '#EFAA86',
        'dark-orang': '#ea8f5f',
        'green': '#3DC5B7',
        'dark-green': '#33aa9d'
      },
      width: {
        '6/7': '80vw',
      },
    },
  },
  plugins: [],
}
