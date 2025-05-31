import { Controller, Post, Body } from '@nestjs/common'
import { WebhookPaymentDto } from 'src/routes/payment/payment.dto'
import { PaymentService } from 'src/routes/payment/payment.service'
import { Auth } from 'src/shared/decorators/auth.decorator'

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('receive')
  @Auth(['PaymentApiKey'])
  receivePayment(@Body() body: WebhookPaymentDto) {
    return this.paymentService.receivePayment(body)
  }
}
