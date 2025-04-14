import { SetMetadata } from '@nestjs/common'
import { AuthType, ConditionGuardType, conditionGuard } from 'src/shared/constants/auth.constant'

export const AUTH_TYPE_KEY = 'authType'

export interface AuthTypeDecoratorPayload {
  authType: AuthType[]
  options?: {
    conditionGuard: ConditionGuardType
  }
}

export const Auth = (authType: AuthType[], options?: { condition: ConditionGuardType }) => {
  return SetMetadata(AUTH_TYPE_KEY, { authType, options: options ?? { condition: conditionGuard.And } })
}

export const IsPublic = () => Auth([AuthType.None])
