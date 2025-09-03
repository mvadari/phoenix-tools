import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { readdirSync } from 'fs'

// Get all HTML files in the root directory
const htmlFiles = readdirSync('.').filter(file => file.endsWith('.html'))

// Create input object for multi-page build + JavaScript entry points
const input = htmlFiles.reduce((acc, file) => {
  const name = file.replace('.html', '')
  acc[name] = resolve(__dirname, file)
  return acc
}, {} as Record<string, string>)

// Add JavaScript entry points
input['js/init'] = resolve(__dirname, 'src/js/init.ts')
input['js/utils'] = resolve(__dirname, 'src/js/utils.ts')
input['js/navigation'] = resolve(__dirname, 'src/js/navigation.ts')
input['js/browsercheck'] = resolve(__dirname, 'src/js/browsercheck.ts')
input['js/styleswitch'] = resolve(__dirname, 'src/js/styleswitch.ts')
input['js/parser'] = resolve(__dirname, 'src/js/parser.ts')
input['js/filter'] = resolve(__dirname, 'src/js/filter.ts')
input['js/utils-dataloader'] = resolve(__dirname, 'src/js/utils-dataloader.ts')
input['js/omnisearch'] = resolve(__dirname, 'src/js/omnisearch.ts')
input['js/spells'] = resolve(__dirname, 'src/js/spells.ts')
input['js/utils-ui'] = resolve(__dirname, 'src/js/utils-ui.ts')
input['js/render'] = resolve(__dirname, 'src/js/render.ts')
input['lib/jquery'] = resolve(__dirname, 'src/lib/jquery.ts')
input['lib/localforage'] = resolve(__dirname, 'src/lib/localforage.ts')
input['lib/elasticlunr'] = resolve(__dirname, 'src/lib/elasticlunr.ts')

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input,
      output: {
        entryFileNames: (chunkInfo) => {
          // Preserve the expected directory structure
          if (chunkInfo.name.startsWith('js/') || chunkInfo.name.startsWith('lib/')) {
            return '[name].js'
          }
          return 'js/[name].js'
        },
        chunkFileNames: 'js/chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || []
          const extType = info[info.length - 1]
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/images/[name].[ext]`
          }
          if (/css/i.test(extType)) {
            return `css/[name].[ext]`
          }
          return `assets/[name].[ext]`
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'js': resolve(__dirname, 'src/js')
    }
  },
  publicDir: 'public',
  server: {
    host: true,
    port: 3000,
    open: '/index.html'
  }
})