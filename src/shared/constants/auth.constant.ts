export const REQUEST_USER_KEY = 'user'
export const REQUEST_ROLE_KEY = 'request_role_permission'
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

export type ConditionGuardType = (typeof conditionGuard)[keyof typeof conditionGuard]

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
  LOGIN: 'LOGIN',
  DISABLE_2FA: 'DISABLE_2FA',
} as const

export type TypeOfVerificationCodeType = (typeof VerificationCodeType)[keyof typeof VerificationCodeType]
