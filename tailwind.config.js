/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // THIS LINE IS CRITICAL. Without it, dark: classes do nothing.
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'brand-navy': '#0B1E4B',
        'brand-royal': '#1A56DB',
        'brand-cyan': '#22D3EE',
      },
    },
  },
  plugins: [],
}