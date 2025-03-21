import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  theme: {
    extend: {
      backgroundImage: {
        'pattern': "url('public/images/calendar.png')"
      }, 
      fontFamily: {
        custom: ['Akira', 'sans-serif'], // Register the custom font
      },
    },
  },
  plugins: [react() ,  tailwindcss()],
})
