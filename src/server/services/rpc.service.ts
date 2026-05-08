import type { CreatePendingQuickNewsDto } from '@/server/services/dto/RPC/CreatePendingQuickNewsDto'
import type { GetPushNotificationPreferencesDto } from '@/server/services/dto/RPC/GetPushNotificationsPreferencesDto'
import type { IsPushNotificationsSubscribedDto } from '@/server/services/dto/RPC/IsPushNotificationsSubscribedDto'
import type { SavePushNotificationsPreferencesDto } from '@/server/services/dto/RPC/SavePushNotificationsPreferencesDto'
import type { SavePushNotificationsSubscriptionDto } from '@/server/services/dto/RPC/SavePushNotificationsSubscriptionDto'
import { env } from 'cloudflare:workers'

export async function createPendingQuickNews(dto: CreatePendingQuickNewsDto) {
  return quickNews().createPendingQuickNews(dto)
}

export async function getPushNotificationPreferences(dto: GetPushNotificationPreferencesDto) {
  return quickNews().getPushNotificationPreferences(dto)
}

export async function isPushNotificationsSubscribed(dto: IsPushNotificationsSubscribedDto) {
  return quickNews().isPushNotificationsSubscribed(dto)
}

export async function savePushNotificationsPreferences(dto: SavePushNotificationsPreferencesDto) {
  return quickNews().savePushNotificationsPreferences(dto)
}

export async function savePushNotificationsSubscription(dto: SavePushNotificationsSubscriptionDto) {
  return quickNews().savePushNotificationsSubscription(dto)
}

interface QuickNews {
  createPendingQuickNews: (dto: CreatePendingQuickNewsDto) => Promise<null | { success: false, errors: Record<string, string[]> }>
  getPushNotificationPreferences: (dto: GetPushNotificationPreferencesDto) => Promise<string[]>
  isPushNotificationsSubscribed: (dto: IsPushNotificationsSubscribedDto) => Promise<boolean>
  savePushNotificationsPreferences: (dto: SavePushNotificationsPreferencesDto) => Promise<void>
  savePushNotificationsSubscription: (dto: SavePushNotificationsSubscriptionDto) => Promise<void>
}

function quickNews(): QuickNews {
  return env.QUICK_NEWS as unknown as QuickNews
}
