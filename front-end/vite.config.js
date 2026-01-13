import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist', // المجلد اللي Render رح ينشره
  },
  base: './', // مهم عشان الروابط داخل SPA تشتغل
})
