import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  base: '/lottery-app/', // only for GitHub Pages base path (仓库名)
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
