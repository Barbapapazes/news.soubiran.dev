import { defineQueryOptions } from '@pinia/colada'
import { postIsSubscribed } from '@/app/api'

export const PUSH_NOTIFICATIONS_QUERY_KEYS = {
  root: ['push-notifications'] as const,
  isSubscribed: () => [...PUSH_NOTIFICATIONS_QUERY_KEYS.root, 'isSubscribed'] as const,
  preferences: () => [...PUSH_NOTIFICATIONS_QUERY_KEYS.root, 'preferences'] as const,
}

export const isSubscribedQuery = defineQueryOptions(() => ({
  key: PUSH_NOTIFICATIONS_QUERY_KEYS.isSubscribed(),
  query: async () => {
    const registration = await navigator.serviceWorker.getRegistration()
    if (!registration) {
      return false
    }

    const subscription = await registration.pushManager.getSubscription()
    if (!subscription) {
      return false
    }

    return postIsSubscribed(subscription.endpoint)
  },
}))
