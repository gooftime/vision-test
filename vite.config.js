import { defineConfig } from 'vite'
import WindiCSS from 'vite-plugin-windicss'
import SolidJS from 'vite-plugin-solid'
import SolidSVG from 'vite-plugin-solid-svg'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [SolidJS(), SolidSVG(), WindiCSS()],
  server: {
    hmr: {
      port: 443,
      timeout: 3000
    }
  }
})
