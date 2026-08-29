/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#060912',
          800: '#0a0f1c',
          700: '#0f172a',
          600: '#16203a',
          500: '#1f2a44',
        },
        emeraldx: {
          50: '#e6fff6',
          100: '#b8ffe6',
          200: '#74ffd0',
          300: '#33f5b6',
          400: '#00e8a0',
          500: '#00d68f',
          600: '#00a86b',
          700: '#00855a',
          800: '#0a6b4a',
        },
        coralx: {
          400: '#ff8a73',
          500: '#ff6b54',
          600: '#ef4d35',
        },
        amberx: {
          400: '#ffc24b',
          500: '#ffb020',
        },
        skyx: {
          400: '#54b8ff',
          500: '#2a9dff',
        },
      },
      fontFamily: {
        display: ['Sora', 'system-ui', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 28px 4px rgba(0,214,143,0.35)',
        'glow-coral': '0 0 28px 4px rgba(255,107,84,0.35)',
        card: '0 12px 40px -12px rgba(0,0,0,0.5)',
        terminal: '0 30px 80px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.06)',
      },
    },
  },
  plugins: [],
};
