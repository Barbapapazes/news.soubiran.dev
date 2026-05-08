import type { AppEnv } from '@/server/context'
import { Hono } from 'hono'
import * as currentUserService from '@/server/services/current-user.service'
import * as quickNewsService from '@/server/services/quick-news.service'
import * as sessionService from '@/server/services/session.service'

const app = new Hono<AppEnv>()

app.post('/', async (c) => {
  const body = await c.req.json()
  const referer = c.req.header('referer') ?? ''
  const cookies = c.req.header('cookie')

  const session = sessionService.get({ cookies })
  const currentUser = await currentUserService.resolveCurrentUser({ session, referer })
  const result = await quickNewsService.createPending({
    user_id: currentUser.id,
    discord_id: currentUser.discord_id ?? '',
    url: body.url,
  })

  if (result && !result.success) {
    return c.json(result.errors, 400)
  }

  return c.body(null, 201)
})

export default app
