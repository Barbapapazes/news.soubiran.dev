export const PUSH_NOTIFICATIONS_QUERY_KEYS = {
  root: ['push-notifications'] as const,
  isSubscribed: () => [...PUSH_NOTIFICATIONS_QUERY_KEYS.root, 'isSubscribed'] as const,
  preferences: () => [...PUSH_NOTIFICATIONS_QUERY_KEYS.root, 'preferences'] as const,
}
