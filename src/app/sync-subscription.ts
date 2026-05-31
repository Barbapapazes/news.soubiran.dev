import { syncPushSubscription } from '@/app/push-subscription'

void syncPushSubscription().catch((error) => {
  console.error('Failed to sync push subscription:', error)
})
