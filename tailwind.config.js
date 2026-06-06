/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-navy': '#071A3D',
        'secondary-navy': '#0B224F',
        'dark-bg': '#051229',
        'card-bg': '#0A1D42',
        'primary-gold': '#D4A017',
        'light-gold': '#F4C542',
        'text-primary': '#FFFFFF',
        'text-secondary': '#C8D0E0',
        'text-muted': '#94A3B8',
        'border-gold': 'rgba(212,160,23,0.25)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #D4A017 0%, #F4C542 100%)',
      },
      boxShadow: {
        'gold-glow': '0 8px 32px rgba(212,160,23,0.12)',
      },
      borderRadius: {
        'xl': '16px',
      }
    },
  },
  plugins: [],
}
