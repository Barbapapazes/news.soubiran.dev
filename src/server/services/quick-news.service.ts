import type { CreatePendingDto } from '@/server/services/dto/QuickNews/CreatePendingDto'
import * as rpcService from '@/server/services/rpc.service'

export function createPending(dto: CreatePendingDto) {
  return rpcService.createPendingQuickNews(dto)
}
