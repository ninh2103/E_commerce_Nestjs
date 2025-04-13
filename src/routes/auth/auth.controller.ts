import { Body, Controller, Ip, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginBodyDto, RegisterBodyDto, SendOtpCodeBodyDto } from 'src/routes/auth/auth.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { userAgent } from 'src/shared/decorators/agent.decotator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterBodyDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }

  @Post('send-otp-code')
  @ZodSerializerDto(SendOtpCodeBodyDto)
  sendOtpCode(@Body() body: SendOtpCodeBodyDto) {
    return this.authService.sendOtpCode(body)
  }

  @Post('login')
  @ZodSerializerDto(LoginBodyDto)
  login(@Body() body: LoginBodyDto, @Ip() ip: string, @userAgent() userAgent: string) {
    return this.authService.login({ ...body, ip, userAgent })
  }
}
