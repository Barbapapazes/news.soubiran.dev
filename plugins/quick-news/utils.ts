import type { QuickNewsArticle } from './types'

export function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll('\'', '&apos;')
}

export function toArticleDate(article: QuickNewsArticle): Date {
  const releasedAt = article.released_at
    ? new Date(`${article.released_at}T00:00:00.000Z`)
    : null

  if (releasedAt && !Number.isNaN(releasedAt.getTime())) {
    return releasedAt
  }

  const createdAt = new Date(`${article.created_at.replace(' ', 'T')}Z`)

  if (!Number.isNaN(createdAt.getTime())) {
    return createdAt
  }

  return new Date()
}
