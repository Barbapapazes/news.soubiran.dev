import z from 'zod'

export const savePushNotificationsPreferencesSchema = z.object({
  preferences: z.enum(['newNews', 'dailyRecap', 'weeklyRecap', 'statusUpdates']).array(),
})
