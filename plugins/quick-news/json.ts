import type { QuickNews } from './types'

export function buildQuickNewsJson(articles: QuickNews[]): string {
  const json = {
    articles: articles.map(article => ({
      title: article.title,
      summary: article.summary,
      url: `${article.url}?utm_source=news.soubiran.dev&utm_medium=api&utm_campaign=news`,
      discord_url: article.discord_message_url,
      released_at: new Date(article.released_at).toISOString(),
      created_at: new Date(article.created_at).toISOString(),
    })),
  }
  return JSON.stringify(json, null, 2)
}
