import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: '/', // Esto indica que la app se sirve desde la raíz
  plugins: [vue()],
})
