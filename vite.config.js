import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  theme: {
    extend: {
      fontFamily: {
        'akira': ['Akira', 'sans-serif'],
      },
      colors: {
        // Core colors
        background: '#0F172A',    // Dark blue - main background
        primary: '#38BDF8',       // Sky blue - primary actions & highlights
        accent: '#F59E0B',        // Amber - secondary actions & accents
        text: '#F1F5F9',          // Off-white - main text color
        highlight: '#EF4444',     // Red - important actions & alerts
        
        // Additional shades
        'background-light': '#1E293B',  // Lighter shade of background for cards
        'primary-dark': '#0EA5E9',      // Darker shade of primary for hover states
        'accent-dark': '#D97706',       // Darker shade of accent for hover states
      },
      animation: {
        'shimmer-slow': 'shimmer 5s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(56, 189, 248, 0.1)' },
          'to': { boxShadow: '0 0 30px rgba(56, 189, 248, 0.4)' }
        }
      },
      backgroundImage: {
        'pattern': "url('public/images/calendar.png')",
        'gradient-primary': 'linear-gradient(135deg, var(--tw-colors-primary) 0%, var(--tw-colors-accent) 100%)',
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '200%': '200% auto',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(56, 189, 248, 0.2)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.2)',
      }
    },
  },
  plugins: [react(), tailwindcss()],
})