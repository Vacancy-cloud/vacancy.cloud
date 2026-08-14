/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#307ae1',
        accent: '#5ff59d',
        background: '#faf9f6',
        text: {
          dark: '#0f172a',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'card': '12px',
      },
      maxWidth: {
        site: '1480px',
      },
    },
  },
  plugins: [],
}


