/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: '#E0511F',
          'primary-fg': '#FFFFFF',
          'soft-accent': '#FFF0EB',
          bg: '#FDFDFD',
          dark: '#000000',
          muted: '#525252',
          border: '#E7E7EE',
          'secondary-bg': '#EDF0F4',
          'secondary-text': '#080808',
        }
      }
    },
  },
  plugins: [],
};
