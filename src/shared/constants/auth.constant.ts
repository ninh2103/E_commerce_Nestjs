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
