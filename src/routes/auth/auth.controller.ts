import { Body, Controller, Ip, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import {
  LoginBodyDto,
  LogoutBodyDto,
  RefreshTokenBodyDto,
  RegisterBodyDto,
  SendOtpCodeBodyDto,
  ForgotPasswordBodyDto,
  Disable2FaResDto,
  Disable2FaBodyDto,
} from 'src/routes/auth/auth.dto'
import { ZodSerializerDto } from 'nestjs-zod'
import { userAgent } from 'src/shared/decorators/agent.decotator'
import { MessageResponseDto } from 'src/shared/dto/message-response.dto'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard'
import { EmptyDtoBody } from 'src/shared/dto/request.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'

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

  @Post('forgot-password')
  @IsPublic()
  @ZodSerializerDto(ForgotPasswordBodyDto)
  forgotPassword(@Body() body: ForgotPasswordBodyDto) {
    return this.authService.forgotPassword(body)
  }

  @Post('2fa/setup')
  @ZodSerializerDto(Disable2FaResDto)
  setup2FA(@Body() _: EmptyDtoBody, @ActiveUser('userId') userId: number) {
    return this.authService.setup2FA(userId)
  }
  @Post('2fa/disable')
  @ZodSerializerDto(Disable2FaBodyDto)
  disable2FA(@Body() body: Disable2FaBodyDto, @ActiveUser('userId') userId: number) {
    return this.authService.disable2FA({ ...body, userId })
  }
}
