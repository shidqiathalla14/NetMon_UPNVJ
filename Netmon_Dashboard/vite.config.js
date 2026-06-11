import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/NetMon_UPNVJ/', // 👈 Pastikan TEPAT SEPERTI INI, bukan Netmon_Project_UPNVJ
})