import type { CurrentUserDto } from '@/server/services/dto/CurrentUser/CurrentUserDto'
import type { ResolveCurrentUserDto } from '@/server/services/dto/CurrentUser/ResolveCurrentUserDto'
import { env } from 'cloudflare:workers'
import { log } from 'evlog'
import { HttpException } from '@/server/exceptions/HttpException'
import { UnauthorizedException } from '@/server/exceptions/UnauthorizedException'
import {
  SESSION_COOKIE_NAME,
} from '../constants'

export async function resolveCurrentUser(dto: ResolveCurrentUserDto): Promise<CurrentUserDto> {
  const { session, referer } = dto

  if (!session) {
    throw new UnauthorizedException()
  }

  try {
    const userResponse = await fetch(`${env.BASE_API_URL}/api/user`, {
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'cookie': `${SESSION_COOKIE_NAME}=${session}`,
        'referer': referer,
      },
    })

    if (!userResponse.ok) {
      throw new UnauthorizedException()
    }

    const payload = await userResponse.json<{ data: { id: number, discord_id: string | null } }>()

    if (!payload || !payload.data) {
      log.warn({
        message: 'Failed to parse the current user from the authentication service response.',
        payload,
      })
      throw new HttpException(500, 'Internal Server Error')
    }

    return {
      id: payload.data.id,
      discord_id: payload.data.discord_id,
    }
  }
  catch (error) {
    if (error instanceof HttpException) {
      throw error
    }

    log.error({
      message: 'News authentication failed while resolving the current API user.',
      error: error instanceof Error ? error.message : error,
    })

    throw new HttpException(500, 'Internal Server Error')
  }
}
