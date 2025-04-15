import react from '@vitejs/plugin-react'
import license from 'rollup-plugin-license'
import { defineConfig, Plugin } from 'vite'
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
      workbox: { clientsClaim: true, skipWaiting: true },
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
        manualChunks: {
          emotion: ['@emotion/react', '@emotion/styled'],
          material: ['@mui/material'],
          icons: ['@mui/icons-material'],
          react: ['react', 'react-dom'],
          redux: ['react-redux'],
          router: ['react-router-dom'],
          maps: ['react-azure-maps'],
          cookie: ['js-cookie'],
          toast: ['react-hot-toast'],
        },
      },
      plugins: [
        license({
          banner: {
            content: '/*! licenses: licenses.txt */',
          },
          thirdParty: {
            includeSelf: true,
            output: { file: 'build/licenses.txt' },
          },
        }) as Plugin,
      ],
    },
  },
})
