import { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

export const userAgent = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest()
  return request.headers['user-agent']
})
