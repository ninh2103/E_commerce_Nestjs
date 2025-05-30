import { Injectable } from '@nestjs/common'
import { PaymentRepo } from './payment.repo'
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model'

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepo: PaymentRepo) {}

  async receivePayment(body: WebhookPaymentBodyType) {
    return this.paymentRepo.receivePayment(body)
  }
}
