
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9f9',
          100: '#dcf0f0',
          200: '#bee0e0',
          300: '#91caca',
          400: '#5faeaf',
          500: '#419293',
          600: '#327678',
          700: '#0D6E6E', // Primary Deep Teal
          800: '#264b4c',
          900: '#223f40',
          950: '#112425',
        },
        crowd: {
          low: '#10b981',      // emerald-500
          moderate: '#f59e0b', // amber-500
          high: '#ef4444',     // red-500
          critical: '#991b1b', // red-800
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'up': '0 -4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
