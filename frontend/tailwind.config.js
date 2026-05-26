/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vibePink: '#FDF2F8',
        vibeOrange: '#FFF7ED',
        vibeWhite: '#FFFFFF',
        textDark: '#1F2937',
        textMuted: '#6B7280',
        accentPink: '#F472B6',
        accentOrange: '#FB923C'
      }
    },
  },
  plugins: [],
}
