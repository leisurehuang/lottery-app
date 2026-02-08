import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  // 开发环境使用根路径，生产环境（GitHub Pages）使用子路径
  base: mode === 'production' ? '/lottery-app/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
}))
