export interface SavePushNotificationsPreferencesDto {
  user_id: number
  discord_id: string | null
  preferences: string[]
}
