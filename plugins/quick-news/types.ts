export interface QuickNews {
  id: string
  title: string
  url: string
  discord_channel_id: string
  discord_message_id: string
  discord_thread_id: string | null
  discord_thread_message_id: string | null
  filename: string
  discord_webhook_id: string
  released_at: string
  created_at: string
  discord_message_url: string
}
