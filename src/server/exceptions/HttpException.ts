import type { ContentfulStatusCode } from 'hono/utils/http-status'

export class HttpException extends Error {
  public readonly statusCode: ContentfulStatusCode

  constructor(statusCode: ContentfulStatusCode, message: string) {
    super(message)
    this.name = 'HttpException'
    this.statusCode = statusCode
  }
}
