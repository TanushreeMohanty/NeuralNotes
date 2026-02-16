import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Add this import

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add this to the plugins list
  ],
  server: {
    host: '0.0.0.0', // Required for Docker visibility
    port: 5173,
  }
})