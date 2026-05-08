import type { GetPreferencesDto } from '@/server/services/dto/PushNotifications/GetPreferencesDto'
import type { IsSubscribedDto } from '@/server/services/dto/PushNotifications/IsSubscribedDto'
import type { SavePreferencesDto } from '@/server/services/dto/PushNotifications/SavedPreferencesDto'
import type { SaveSubscriptionDto } from '@/server/services/dto/PushNotifications/SaveSubscriptionDto'
import * as rpcService from '@/server/services/rpc.service'

export function getPreferences(
  dto: GetPreferencesDto,
) {
  return rpcService.getPushNotificationPreferences(dto)
}

export function isSubscribed(
  dto: IsSubscribedDto,
) {
  return rpcService.isPushNotificationsSubscribed(dto)
}

export function savePreferences(
  dto: SavePreferencesDto,
) {
  return rpcService.savePushNotificationsPreferences(dto)
}

export function saveSubscription(
  dto: SaveSubscriptionDto,
) {
  return rpcService.savePushNotificationsSubscription({
    scope: 'news',
    ...dto,
  })
}
