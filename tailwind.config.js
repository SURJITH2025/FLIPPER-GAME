/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'neon-bg': '#0a0e27',
        'neon-blue': '#00ffff',
        'neon-purple': '#ff00ff',
        'neon-green': '#00ff88',
        'glass-dark': 'rgba(10, 14, 39, 0.8)',
        'glass-border': 'rgba(0, 255, 255, 0.3)',
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'bg-pulse': 'bgPulse 15s ease-in-out infinite',
        'title-glow': 'titleGlow 3s ease-in-out infinite',
        'neon-pulse': 'neonPulse 2s infinite',
        'modal-slide': 'modalSlideIn 0.3s ease',
        'match-pulse': 'matchPulse 0.6s ease',
      },
      keyframes: {
        bgPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        titleGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 20px rgba(0, 255, 255, 0.5))' },
          '50%': { filter: 'drop-shadow(0 0 30px rgba(255, 0, 255, 0.8))' },
        },
        neonPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 255, 255, 0.6)' },
        },
        modalSlideIn: {
          'from': { transform: 'translateY(-50px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        matchPulse: {
          '0%, 100%': { transform: 'rotateY(180deg) scale(1)' },
          '50%': { transform: 'rotateY(180deg) scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
