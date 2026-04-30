import type { QuickNews } from './types'
import { QUICK_NEWS_SITE_URL } from './constants'
import { escapeXml, toArticleDate } from './utils'

export function buildQuickNewsRss(articles: QuickNews[]): string {
  const sortedArticles = [...articles].sort((left, right) => {
    return toArticleDate(right).getTime() - toArticleDate(left).getTime()
  })

  const items = sortedArticles.map((article) => {
    const title = escapeXml(article.title)
    const link = escapeXml(article.url)
    const guid = escapeXml(article.id)
    const pubDate = toArticleDate(article).toUTCString()
    const description = escapeXml([
      article.summary,
      `Original article: ${article.url}`,
      article.discord_message_url ? `Discord summary: ${article.discord_message_url}` : '',
    ].filter(Boolean).join('\n'))

    return [
      '    <item>',
      `      <title>${title}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="false">${guid}</guid>`,
      `      <pubDate>${pubDate}</pubDate>`,
      `      <description>${description}</description>`,
      article.discord_message_url ? `      <source url="${escapeXml(article.discord_message_url)}">Discord summary</source>` : '',
      '    </item>',
    ].filter(Boolean).join('\n')
  }).join('\n')

  const lastBuildDate = (sortedArticles[0] ? toArticleDate(sortedArticles[0]) : new Date()).toUTCString()

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0">',
    '  <channel>',
    '    <title>Quick News</title>',
    `    <link>${escapeXml(QUICK_NEWS_SITE_URL)}</link>`,
    '    <description>Articles I read and summarized with AI on Discord.</description>',
    '    <language>en</language>',
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n')
}
