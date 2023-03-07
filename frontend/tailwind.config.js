/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
      screens:{
        xs:'640px',
        sm:'990px',
        md:'1200px',
        lg:'1400px',
        xl:'1600px'
      }
    },
    plugins: [],
  }