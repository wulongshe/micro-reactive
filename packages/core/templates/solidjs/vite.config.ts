import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import TrackEffect from './plugins/vite-plugin-track-effect'

export default defineConfig({
  plugins: [solidPlugin(), TrackEffect()],
  build: {
    minify: false
  }
})
