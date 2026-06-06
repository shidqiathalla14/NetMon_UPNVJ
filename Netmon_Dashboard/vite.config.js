import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Prototype2_Netmon_PPL/', // <-- SESUAIKAN DENGAN NAMA REPO GITHUB LU
})