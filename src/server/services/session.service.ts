import type { GetDto } from '@/server/services/dto/Session/GetDto'
import { SESSION_COOKIE_NAME } from '@/server/constants'
import { MissingSessionException } from '@/server/exceptions/MissingSessionException'

export function get(dto: GetDto): string {
  const { cookies } = dto

  if (!cookies) {
    throw new MissingSessionException()
  }

  const cookie = cookies
    .split(';')
    .find(entry => entry.trim().startsWith(`${SESSION_COOKIE_NAME}=`))

  if (!cookie) {
    throw new MissingSessionException()
  }

  return cookie.trim().slice(SESSION_COOKIE_NAME.length + 1)
}
