import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charger les variables d'environnement basées sur le mode (dev, production, etc.)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api/predictions': {
          target: env.VITE_PREDICTION_API_BASE_URL || 'http://192.168.1.85:8001',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/predictions/, '/predictions'),
          configure: (proxy, options) => {
            proxy.on('proxyReq', (proxyReq, req, res) => {
              // Ajouter la clé API dans les headers
              const apiKey = env.VITE_PREDICTION_API_KEY || 'fjFonsXHGSE7QcY4UVb1oV78xNhPjyQl7CR5DrNRcty3dtn06z'
              proxyReq.setHeader('X-API-Key', apiKey)
            })
          }
        }
      }
    }
  }
})
