import { HttpException } from '@/server/exceptions/HttpException'

export class UnauthorizedException extends HttpException {
  constructor(message = 'Unauthorized') {
    super(401, message)
    this.name = 'UnauthorizedException'
  }
}
