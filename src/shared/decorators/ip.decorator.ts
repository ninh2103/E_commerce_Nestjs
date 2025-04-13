import requestIp from 'request-ip'
import { ExecutionContext } from '@nestjs/common'
import { createParamDecorator } from '@nestjs/common'

export const Ip = createParamDecorator((data: unknown, ctx: ExecutionContext): string => {
  const request = ctx.switchToHttp().getRequest()
  const clientIp = requestIp.getClientIp(request)
  return clientIp || request.ip
})
