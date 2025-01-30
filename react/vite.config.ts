import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import jsconfigPaths from 'vite-jsconfig-paths'
import { createHtmlPlugin } from 'vite-plugin-html'
import { VitePWA } from 'vite-plugin-pwa'

// Adapted from https://github.com/Grvs44/budgetmanager/blob/main/budgetmanagerpwa/vite.config.js
export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    VitePWA({
      injectRegister: 'inline',
      manifest: false,
    }),
    createHtmlPlugin({ minify: true }),
  ],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  build: {
    manifest: true,
    outDir: 'build',
    assetsDir: 'static',
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      preserveEntrySignatures: 'exports-only',
    },
  },
})
