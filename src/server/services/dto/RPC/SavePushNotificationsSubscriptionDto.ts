export interface SavePushNotificationsSubscriptionDto {
  scope: string
  user_id: number
  discord_id: string | null
  endpoint: string
  expiration_time: number | null
  keys: {
    p256dh: string
    auth: string
  }
}
