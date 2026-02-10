import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './', // 关键：确保构建后的资源使用相对路径，以便在任意子目录运行
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
