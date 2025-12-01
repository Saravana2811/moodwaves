import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Use env var when available (useful for dev on other devices)
        target: process.env.VITE_MOODWAVES_API_URL || 'https://mv-music-backend.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
