import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { conditionGuard } from 'src/shared/constants/auth.constant'
import { AuthType } from 'src/shared/constants/auth.constant'
import { AUTH_TYPE_KEY, AuthTypeDecoratorPayload } from 'src/shared/decorators/auth.decorator'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard'

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private authTypeGuardMap: Record<AuthType, CanActivate>

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
    private readonly apiKeyGuard: ApiKeyGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.ApiKey]: this.apiKeyGuard,
      [AuthType.None]: { canActivate: () => true },
    }
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const AuthTypeValue = this.reflector.getAllAndOverride<AuthTypeDecoratorPayload | undefined>(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) ?? { authType: [AuthType.Bearer], options: { conditionGuard: conditionGuard.And } }

    const guard = AuthTypeValue?.authType.map((authType) => this.authTypeGuardMap[authType])
    let error = new UnauthorizedException()
    if (AuthTypeValue?.options?.conditionGuard === conditionGuard.Or) {
      for (const g of guard) {
        const canActivate = await Promise.resolve(g.canActivate(context)).catch((err) => {
          error = err
          return false
        })
        if (canActivate) {
          return true
        }
      }
      throw error
    } else {
      for (const g of guard) {
        const canActivate = await Promise.resolve(g.canActivate(context)).catch((err) => {
          error = err
          return false
        })
        if (!canActivate) {
          throw error
        }
      }
      return true
    }
  }
}
