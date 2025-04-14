import { Body, Controller, Ip, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  LoginBodyDto,
  LogoutBodyDto,
  RefreshTokenBodyDto,
  RegisterBodyDto,
  SendOtpCodeBodyDto,
} from 'src/routes/auth/auth.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { userAgent } from 'src/shared/decorators/agent.decotator'
import { MessageResponseDto } from 'src/shared/dto/message-response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  @ZodSerializerDto(RegisterBodyDto)
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }

  @Post('send-otp-code')
  @IsPublic()
  sendOtpCode(@Body() body: SendOtpCodeBodyDto) {
    return this.authService.sendOtpCode(body)
  }

  @Post('login')
  @IsPublic()
  @ZodSerializerDto(LoginBodyDto)
  login(@Body() body: LoginBodyDto, @Ip() ip: string, @userAgent() userAgent: string) {
    return this.authService.login({ ...body, ip, userAgent })
  }

  @Post('refresh-token')
  @IsPublic()
  @ZodSerializerDto(RefreshTokenBodyDto)
  refreshToken(@Body() body: RefreshTokenBodyDto, @Ip() ip: string, @userAgent() userAgent: string) {
    return this.authService.refreshToken({ refreshToken: body.refreshToken, ip, userAgent })
  }

  @Post('logout')
  @ZodSerializerDto(MessageResponseDto)
  logout(@Body() body: LogoutBodyDto) {
    return this.authService.logout(body)
  }
}
