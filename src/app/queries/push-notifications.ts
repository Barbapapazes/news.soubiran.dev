import { defineQueryOptions } from '@pinia/colada'
import { getPushNotificationPreferences } from '@/app/api'
import { syncPushSubscription } from '@/app/push-subscription'

export const PUSH_NOTIFICATIONS_QUERY_KEYS = {
  root: ['push-notifications'] as const,
  isSubscribed: () => [...PUSH_NOTIFICATIONS_QUERY_KEYS.root, 'isSubscribed'] as const,
  preferences: () => [...PUSH_NOTIFICATIONS_QUERY_KEYS.root, 'preferences'] as const,
}

export const isSubscribedQuery = defineQueryOptions(() => ({
  key: PUSH_NOTIFICATIONS_QUERY_KEYS.isSubscribed(),
  query: async () => {
    const subscription = await syncPushSubscription()

    return {
      isSubscribed: Boolean(subscription),
    }
  },
}))

export const preferencesQuery = defineQueryOptions(() => ({
  key: PUSH_NOTIFICATIONS_QUERY_KEYS.preferences(),
  query: () => getPushNotificationPreferences(),
}))
