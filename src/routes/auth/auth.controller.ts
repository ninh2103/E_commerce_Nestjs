import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { RegisterBodyDto } from 'src/routes/auth/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() body: RegisterBodyDto) {
    return this.authService.register(body)
  }
}
