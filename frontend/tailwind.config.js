/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: '640px',
      sm: '990px',
      md: '1200px',
      lg: '1400px',
      xl: '1600px'
    },
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      red: '#ff414d',
      blue: '#00c3ff',
      purple: '#4346e1',
      green: '#3b9f43',
      grey: '#a7a7a7',
      dark: '#2d2d2d',
      black: '#000000'
    }
  },
  plugins: [],
}