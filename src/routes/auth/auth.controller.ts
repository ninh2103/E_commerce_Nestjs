import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDto, SendOtpCodeBodyDto } from 'src/routes/auth/auth.dto'
import { ZodSerializerDto } from 'nestjs-zod'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterBodyDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }

  @Post('send-otp-code')
  sendOtpCode(@Body() body: SendOtpCodeBodyDto) {
    return this.authService.sendOtpCode(body)
  }
}
