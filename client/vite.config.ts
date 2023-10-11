import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxying websockets or socket.io
      '/socket.io': {
        target: 'ws://localhost:4000',
        ws: true
      }
    }
  }
})
