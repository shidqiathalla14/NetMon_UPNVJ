import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Netmon_Project_UPNVJ/', // 👈 Pastikan ada garis miring di awal dan akhir!
})