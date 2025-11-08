/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0b0b0f',
        foreground: '#e6e6eb',
        card: '#121219',
        muted: '#1a1a24',
        accent: '#7c5cff'
      },
      borderRadius: {
        '2xl': '1.25rem'
      },
      boxShadow: {
        'soft': '0 10px 30px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: []
}
