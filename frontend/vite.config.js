import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  const backendUrl = env.BACKEND_URL

  return {
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true,
      proxy: backendUrl
        ? {
            '/api': {
              target: backendUrl,
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
    },
  }
})
