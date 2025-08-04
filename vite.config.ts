import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/webhook': {
        target: 'https://hook.eu2.make.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/webhook/, ''),
        secure: true,
        headers: {
          'Origin': 'https://hook.eu2.make.com'
        }
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
