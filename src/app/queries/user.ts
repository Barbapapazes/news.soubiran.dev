import { defineQueryOptions } from '@pinia/colada'
import { getUser } from '@/app/api'

export const USER_QUERY_KEYS = {
  root: ['user'] as const,
}

export const userQuery = defineQueryOptions(() => ({
  key: USER_QUERY_KEYS.root,
  query: getUser,
}))
