import { ofetch } from 'ofetch'

const api = ofetch.create({
  baseURL: '/api',
})

interface User {
  id: number
  discord_id: string | null
}

export async function getUser() {
  return ofetch<{ data: User }>('/api/user', {
    baseURL: import.meta.env.VITE_BASE_API_URL,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    credentials: 'include',
  })
}

export async function postPendingQuickNews(url: string) {
  return api('/api/quick-news', {
    method: 'POST',
    credentials: 'include',
    body: {
      url,
    },
  })
}

export async function getPushNotificationPreferences() {
  return api('/api/push-notifications/preferences', {
    method: 'GET',
    credentials: 'include',
  })
}

export async function postPushNotificationPreferences(preferences: string[]) {
  return api('/api/push-notifications/preferences', {
    method: 'POST',
    credentials: 'include',
    body: {
      preferences,
    },
  })
}

export async function postPushNotificationSubscription(subscription: PushSubscriptionJSON) {
  return api('/api/push-notifications/subscriptions', {
    method: 'POST',
    credentials: 'include',
    body: {
      endpoint: subscription.endpoint,
      expiration_time: subscription.expirationTime,
      keys: subscription.keys,
    },
  })
}

export async function postIsSubscribed(endpoint: string) {
  return api('/api/push-notifications/subscribed', {
    method: 'POST',
    credentials: 'include',
    body: {
      endpoint,
    },
  })
}
