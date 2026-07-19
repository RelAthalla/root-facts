import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.ico',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
        'icons/apple-touch-icon.png',
        'model/model.json',
        'model/weights.bin',
        'model/metadata.json',
      ],
      manifest: {
        name: 'Root Fact App',
        short_name: 'RootFact',
        description: 'Aplikasi React untuk mendeteksi sayuran lokal dan membuat fun fact dengan AI browser.',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#178a62',
        icons: [
          {
            src: '/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,bin,webmanifest}'],
        globIgnores: ['**/assets/ort-wasm*.wasm'],
        maximumFileSizeToCacheInBytes: 35 * 1024 * 1024,
        navigateFallback: '/index.html',
        additionalManifestEntries: [
          { url: '/model/model.json', revision: 'root-fact-cv-v1' },
          { url: '/model/weights.bin', revision: 'root-fact-cv-v1' },
          { url: '/model/metadata.json', revision: 'root-fact-cv-v1' },
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) => (
              request.destination === 'script'
              || request.destination === 'style'
              || request.destination === 'image'
              || url.pathname.endsWith('.wasm')
            ),
            handler: 'CacheFirst',
            options: {
              cacheName: 'root-fact-runtime-assets-v1',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/huggingface\.co\/.*$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'transformers-model-cache-v1',
              expiration: {
                maxEntries: 80,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
  server: {
    port: 3001,
    host: true,
  },
});
