import { Injectable } from '@nestjs/common'
import { Resend } from 'resend'
import envConfig from '../config'
@Injectable()
export class EmailService {
  private resend: Resend
  constructor() {
    this.resend = new Resend(envConfig.API_KEY)
  }
  sendEmail(payload: { email: string; code: string }) {
    return this.resend.emails.send({
      from: 'onboarding@resend.dev',
      to: payload.email,
      subject: 'OTP Code',
      text: `Your OTP code is ${payload.code}`,
    })
  }
}
