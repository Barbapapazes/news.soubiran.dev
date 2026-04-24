import type { Plugin, ResolvedConfig } from 'vite'
import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { QUICK_NEWS_FEED_PATH } from './constants'
import { fetchQuickNews } from './quick-news'
import { buildQuickNewsRss } from './rss'

export function quickNews(): Plugin[] {
  return [
    virtualQuickNews(),
    rss(),
  ]
}

function virtualQuickNews(): Plugin {
  let mode: string

  const QUICK_NEWS_MODULE_ID = 'virtual:quick-news'
  const RESOLVED_QUICK_NEWS_MODULE_ID = `\0${QUICK_NEWS_MODULE_ID}`

  return {
    name: 'quick-news:virtual-module',
    config(_, env) {
      mode = env.mode
    },
    resolveId: {
      filter: {
        id: new RegExp(`^${QUICK_NEWS_MODULE_ID}$`),
      },
      handler: () => {
        return RESOLVED_QUICK_NEWS_MODULE_ID
      },
    },
    load: {
      filter: {
        id: new RegExp(`^${RESOLVED_QUICK_NEWS_MODULE_ID}$`),
      },
      handler: async () => {
        const articles = await fetchQuickNews(mode)

        return `export default ${JSON.stringify(articles)}`
      },
    },
  }
}

function rss(): Plugin {
  let mode: string
  let config: ResolvedConfig | undefined

  return {
    name: 'quick-news:rss',
    apply: 'build',
    config(_, env) {
      mode = env.mode
    },
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    async closeBundle() {
      const outDir = resolve(config?.root as string, config?.build.outDir as string)
      const articles = await fetchQuickNews(mode)

      await mkdir(outDir, { recursive: true })
      await writeFile(resolve(outDir, QUICK_NEWS_FEED_PATH), buildQuickNewsRss(articles), 'utf8')
    },
  }
}
