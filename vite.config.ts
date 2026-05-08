import ui from '@soubiran/ui/ui'
import soubiran from '@soubiran/vite'
import { defineConfig } from 'vite'

import { quickNews } from './plugins/quick-news'

export default defineConfig(() => {
  return {
    plugins: [
      quickNews(),
      soubiran({
        title: 'News',
        hostname: 'news.soubiran.dev',
        ui: {
          ui,
        },
        ssg: false,
        api: false,
        meta: false,
        sitemap: false,
        markdown: false,
      }),
    ],
  }
})
