import type { QuickNews } from './types'
import process from 'node:process'
import { loadEnv } from 'vite'
import { z } from 'zod'
import { QUICK_NEWS_SOURCE_URL } from './constants'

const quickNewsSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  discord_channel_id: z.string(),
  discord_message_id: z.string(),
  discord_thread_id: z.string().nullable(),
  discord_thread_message_id: z.string().nullable(),
  filename: z.string(),
  discord_webhook_id: z.string(),
  released_at: z.string(),
  created_at: z.string(),
  discord_message_url: z.string(),
})

const quickNewsListSchema = z.array(quickNewsSchema)

export async function fetchQuickNews(mode: string): Promise<QuickNews[]> {
  const env = loadEnv(mode, process.cwd(), '')
  const clientId = env.QUICK_NEWS_CF_ACCESS_CLIENT_ID
  const clientSecret = env.QUICK_NEWS_CF_ACCESS_CLIENT_SECRET

  try {
    const response = await fetch(`${QUICK_NEWS_SOURCE_URL}/api/quick-news`, {
      headers: {
        'Accept': 'application/json',
        'CF-Access-Client-Id': clientId,
        'CF-Access-Client-Secret': clientSecret,
      },
    })

    if (!response.ok) {
      throw new Error(`Quick News request failed with status ${response.status} ${response.statusText}`)
    }

    const contentType = response.headers.get('content-type') ?? ''

    if (!contentType.includes('application/json')) {
      throw new TypeError(`Quick News response is not JSON (received ${contentType || 'unknown content type'}).`)
    }

    const payload = await response.json()

    return quickNewsListSchema.parse(payload)
  }
  catch (error) {
    throw new Error(`Failed to fetch Quick News articles: ${(error as Error).message}`)
  }
}
