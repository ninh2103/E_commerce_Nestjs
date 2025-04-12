export const REQUEST_USER_KEY = 'user'

export const AuthType = {
  Bearer: 'Bearer',
  None: 'None',
  ApiKey: 'ApiKey',
} as const

export type AuthType = (typeof AuthType)[keyof typeof AuthType]

export const conditionGuard = {
  And: 'And',
  Or: 'Or',
} as const

export type ConditionGuard = (typeof conditionGuard)[keyof typeof conditionGuard]

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  BLOCKED: 'BLOCKED',
} as const

export const UserRole = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const

export const VerificationCodeType = {
  REGISTER: 'REGISTER',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
} as const
