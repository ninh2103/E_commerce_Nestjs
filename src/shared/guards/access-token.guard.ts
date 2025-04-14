import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import { REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import { TokenService } from '../sharedServices/token.service'
import { extractAccessToken } from 'src/shared/helpers'
@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(private readonly jwtService: TokenService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const accessToken = extractAccessToken(request)

    if (!accessToken) {
      throw new UnauthorizedException()
    }
    try {
      const decodeAccessToken = await this.jwtService.verifyAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decodeAccessToken
      return true
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
