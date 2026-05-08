import type { AppEnv } from '@/server/context'
import { Hono } from 'hono'
import * as currentUserService from '@/server/services/current-user.service'
import * as pushNotificationsService from '@/server/services/push-notifications.service'
import * as sessionService from '@/server/services/session.service'

const app = new Hono<AppEnv>()

app.get('/preferences', async (c) => {
  const referer = c.req.header('referer') ?? ''
  const cookies = c.req.header('cookie')

  const session = sessionService.get({ cookies })
  const currentUser = await currentUserService.resolveCurrentUser({ session, referer })
  const preferences = await pushNotificationsService.getPreferences({ user_id: currentUser.id })

  return c.json({ preferences })
})

app.post('/preferences', async (c) => {
  const body = await c.req.json()
  const referer = c.req.header('referer') ?? ''
  const cookies = c.req.header('cookie')

  const session = sessionService.get({ cookies })
  const currentUser = await currentUserService.resolveCurrentUser({ session, referer })
  await pushNotificationsService.savePreferences({ user_id: currentUser.id, discord_id: currentUser.discord_id, preferences: body.preferences })

  return c.json(null, 201)
})

app.post('/subscriptions', async (c) => {
  const body = await c.req.json()
  const referer = c.req.header('referer') ?? ''
  const cookies = c.req.header('cookie')

  const session = sessionService.get({ cookies })
  const currentUser = await currentUserService.resolveCurrentUser({ session, referer })
  await pushNotificationsService.saveSubscription({ user_id: currentUser.id, discord_id: currentUser.discord_id, ...body })

  return c.json(null, 201)
})

app.post('/subscribed', async (c) => {
  const body = await c.req.json()
  const referer = c.req.header('referer') ?? ''
  const cookies = c.req.header('cookie')

  const session = sessionService.get({ cookies })
  const currentUser = await currentUserService.resolveCurrentUser({ session, referer })
  const isSubscribed = await pushNotificationsService.isSubscribed({ user_id: currentUser.id, endpoint: body.endpoint })

  return c.json({ isSubscribed })
})

export default app
