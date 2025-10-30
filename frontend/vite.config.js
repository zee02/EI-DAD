// vite.config.js

import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss()],
  
  // FIX: Add the server block with the proxy configuration
  server: {
    proxy: {
      // Forward ANY request starting with /api/ to the Laravel server
      '/api': {
        target: 'http://127.0.0.1:8000', 
        changeOrigin: true,
        secure: false,
        // The rewrite line is often necessary to ensure the backend sees the path correctly
        // but for a direct '/api/metadata' target, we can keep it simple.
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})