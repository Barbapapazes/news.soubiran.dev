import { fileURLToPath, URL } from 'node:url'
import { cloudflare } from '@cloudflare/vite-plugin'
import ui from '@nuxt/ui/vite'
import vue from '@vitejs/plugin-vue'
import icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite'
import { quickNews } from './plugins/quick-news'

export default defineConfig(() => {
  return {
    plugins: [
      quickNews(),
      vue(),
      ui({
        router: false,
        autoImport: {
          dts: 'src/auto-imports.d.ts',
          dirs: ['src/composables'],
        },
        components: {
          dts: 'src/components.d.ts',
        },
      }),
      icons({
        autoInstall: true,
      }),
      cloudflare(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
