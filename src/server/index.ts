import type { ContentfulStatusCode } from 'hono/utils/http-status'
import type { AppEnv } from './context'
import { sentry } from '@sentry/hono/cloudflare'
import { WorkerEntrypoint } from 'cloudflare:workers'
import { parseError } from 'evlog'
import { evlog } from 'evlog/hono'
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
import { HttpException } from '@/server/exceptions/HttpException'
import { MissingSessionException } from '@/server/exceptions/MissingSessionException'
import pendingQuickNewsController from './controllers/pending-quick-news.controller'
import pushNotificationsController from './controllers/push-notifications.controller'

const app = new Hono<AppEnv>()

app.use(
  sentry(app, env => ({
    dsn: env.SENTRY_DSN,
    environment: env.SENTRY_ENVIRONMENT,
    tracesSampleRate: Number(env.SENTRY_TRACES_SAMPLE_RATE),
    enableLogs: true,
    sendDefaultPii: true,
  })),
)

app.use('/api/*', evlog({ include: ['/api/**'] }))

app.use(csrf())

app.get('/api/debug-sentry', () => {
  throw new Error('My first Sentry error!')
})

app.onError((error, c) => {
  c.get('log').error(error)

  if (error instanceof HttpException) {
    return c.json({ message: error.message }, error.statusCode)
  }

  if (error instanceof MissingSessionException) {
    return c.json({ message: error.message }, 401)
  }

  const parsed = parseError(error)
  const status = typeof parsed.status === 'number' ? parsed.status as ContentfulStatusCode : 500

  return c.json({ message: parsed.message || 'Internal Server Error' }, status)
})

app.notFound((c) => {
  return c.text('Not found', 404)
})

app.route('/api/quick-news', pendingQuickNewsController)
app.route('/api/push-notifications', pushNotificationsController)

export default class NewsWorker extends WorkerEntrypoint<Env> {
  async fetch(request: Request) {
    return app.fetch(request, this.env, this.ctx)
  }
}
