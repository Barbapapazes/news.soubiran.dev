globalThis.addEventListener('install', (event) => {
  event.waitUntil(globalThis.skipWaiting())
})

globalThis.addEventListener('activate', (event) => {
  event.waitUntil(globalThis.clients.claim())
})

globalThis.addEventListener('push', (event) => {
  const payload = event.data?.json() ?? {}
  const title = payload.title ?? 'News'
  const body = payload.body ?? ''
  const data = payload.data ?? {}

  event.waitUntil(globalThis.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    data,
  }))
})

globalThis.addEventListener('notificationclick', (event) => {
  const targetUrl = getNotificationTargetUrl(event.notification.data)

  event.waitUntil(
    Promise.resolve().then(async () => {
      event.notification.close()

      const clientList = await globalThis.clients.matchAll({ type: 'window', includeUncontrolled: true })

      for (const client of clientList) {
        if (client.url === targetUrl && 'focus' in client) {
          return client.focus()
        }
      }

      if (globalThis.clients.openWindow) {
        return globalThis.clients.openWindow(targetUrl)
      }
    }),
  )
})

function getNotificationTargetUrl(data) {
  if (typeof data?.url === 'string' && data.url.length > 0) {
    return new URL(data.url, globalThis.location.origin).href
  }

  return new URL('/', globalThis.location.origin).href
}
