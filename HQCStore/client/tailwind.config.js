/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif']
    },
    extend: {
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#ee3131',
        overlay: 'rgba(0,0,0,0.3)'
      },
      colors: {
        main: '#ee3131'
      },
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
      },
      gridTemplateRows: {
        //devide row
        '8': 'repeat (8, minmax(0, 1fr))',
        '10': 'repeat (10, minmax(0, 1fr))',

        //Complex site-specific row configuration
        'layout': '200px minmax(900px, 1fr) 100px'

      },
      keyframes: {
        'slide-top': {
          '0%': {
            '-webkit-transform': 'translateY(40px)',
            transform: 'translateY(40px)'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px)',
            transform: 'translateY(0px)'
          }
        },
        'slide-top-sm': {
          '0%': {
            '-webkit-transform': 'translateY(4px)',
            transform: 'translateY(4px)'
          },
          '100%': {
            '-webkit-transform': 'translateY(0px)',
            transform: 'translateY(0px)'
          }
        },
        'scale-up-center': {
          '0%': {
            '-webkit-transform': 'scale(0.5)',
            transform: 'scale(0.5)'
          },
          '100%': {
            '-webkit-transform': 'scale(1)',
            transform: 'scale(1)'
          }
        }
      },
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slide-top-sm': 'slide-top-sm 0.2s linear both',
        'scale-up-center': 'scale-up-center 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both'
      }
    },
  },
  plugins: [
    '@tailwindcss/line-clamp',
  ],
}

