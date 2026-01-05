import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api/predictions': {
        target: 'http://192.168.1.85:8001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/predictions/, '/predictions'),
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Ajouter la clé API dans les headers
            proxyReq.setHeader('X-API-Key', 'fjFonsXHGSE7QcY4UVb1oV78xNhPjyQl7CR5DrNRcty3dtn06z')
          })
        }
      }
    }
  }
})
