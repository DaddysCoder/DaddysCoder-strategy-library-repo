/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.svg', 'brand/*.svg'],
      manifest: {
        name: 'Strategy Library — Positive Behaviour Support, by Primitive AI',
        short_name: 'Strategy Library',
        description:
          'Evidence-based, citable positive-behaviour-support strategies for practitioners to select from and personalise — decision support, not a generator.',
        theme_color: '#111111',
        background_color: '#FFFFFF',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'brand/favicon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'brand/favicon-512.svg', sizes: '512x512', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        // Local-first: precache the app shell only. PersonalisationRecords
        // live in IndexedDB and are never fetched/cached by the service
        // worker. StrategyTemplate content ships bundled in Phase 1 (no
        // central-hosted split yet — see README).
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/lib/testSetup.ts'],
  },
})
