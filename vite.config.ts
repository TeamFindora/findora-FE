import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://13.209.35.248:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy) => {
          proxy.on('error', (err, req, res) => {
            console.log('프록시 에러:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('프록시 요청:', req.method, req.url, '→', `http://13.209.35.248:8080${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('프록시 응답:', req.method, req.url, '상태:', proxyRes.statusCode);
          });
        }
      }
    }
  }
})
