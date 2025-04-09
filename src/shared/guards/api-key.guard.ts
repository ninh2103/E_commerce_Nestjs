import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Observable } from 'rxjs'
import envConfig from 'src/shared/config'

@Injectable()
export class ApiKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest()
    const apiKey = request.headers['x-api-key']
    if (!apiKey) {
      return false
    }
    try {
      const isApiKeyValid = apiKey === envConfig.SECRET_KEY
      if (!isApiKeyValid) {
        return false
      }
      return true
    } catch (error) {
      throw new UnauthorizedException()
    }
  }
}
