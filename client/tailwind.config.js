/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bx: {
          bg: '#0a0a0f',
          surface: '#111118',
          card: '#16161f',
          border: 'rgba(255, 255, 255, 0.07)',
          red: '#E03030',
          'red-hover': '#ff4444',
          'red-dim': 'rgba(224, 48, 48, 0.15)',
          text: '#f0efea',
          muted: '#7a7a8a'
        }
      },
      fontFamily: {
        display: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [],
};

