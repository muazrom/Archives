import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005, // Specifically set port to 3005 to avoid conflicts
    strictPort: true, // Fail if port 3005 is already in use
  }
})
