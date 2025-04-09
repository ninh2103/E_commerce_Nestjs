import { SetMetadata } from '@nestjs/common'
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant'

export const AUTH_TYPE_KEY = 'authType'

export interface AuthTypeDecoratorPayload {
  authType: AuthType[]
  options?: {
    conditionGuard: ConditionGuard
  }
}

export const Auth = (authType: AuthType[], options?: { conditionGuard: ConditionGuard }) => {
  return SetMetadata(AUTH_TYPE_KEY, { authType, ...options })
}
