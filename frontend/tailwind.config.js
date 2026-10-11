/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',      // Primary background
          surface: '#1a1a1a', // Card background
          hover: '#252525'    // Card hover
        },
        accent: {
          primary: '#ff6b35',   // Neon orange main
          secondary: '#ffa500', // Yellow core
          success: '#00d4aa',   // Teal success/check
          neutral: '#a0a0a0',   // Gray text
          light: '#ffffff',     // Primary text
          border: '#333333'     // Subdued borders
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        logo: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'pulse 4s ease-in-out infinite',
        'float-badge': 'float 3s ease-in-out infinite',
        'neon-shine': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { filter: 'brightness(1)' },
          '50%': { filter: 'brightness(1.3)' },
        }
      }
    },
  },
  plugins: [],
}
