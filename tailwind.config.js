/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta-sans)', 'system-ui', '-apple-system', 'sans-serif'],
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
