import { Injectable } from '@nestjs/common'
import { PaymentRepo } from './payment.repo'
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model'

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepo) {}

  async receivePayment(body: WebhookPaymentBodyType) {
    const result = await this.paymentRepo.receivePayment(body)
    return result
  }
}
