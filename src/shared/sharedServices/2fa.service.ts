import { Injectable } from '@nestjs/common'
import { AuthRepository } from 'src/routes/auth/auth.repo'
import * as OTPAuth from 'otpauth'

@Injectable()
export class TwoFactorAuthService {
  private createTOTP(email: string, secret?: string) {
    return new OTPAuth.TOTP({
      issuer: 'Ecommerce',
      label: email,
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secret || new OTPAuth.Secret(),
    })
  }

  generateTOTP(email: string) {
    const totp = this.createTOTP(email)
    return {
      secret: totp.secret.base32,
      uri: totp.toString(),
    }
  }
  verifyTOTP({ email, token, secret }: { email: string; token: string; secret: string }): boolean {
    const totp = this.createTOTP(email, secret)
    const delta = totp.validate({ token, window: 1 })
    return delta !== null
  }
}
