import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://strensiq-hcp.com/',
  build: {
    format: 'directory',
    assets: 'assets/js'
  },
  vite: {
    css: {
      devSourcemap: true
    },
    build: {
      minify: false,
      rollupOptions: {
        output: {
          assetFileNames: 'assets/css/style[extname]'
        }
      }
    }
  }
})
