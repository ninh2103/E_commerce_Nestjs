import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { CANCEL_PAYMENT_QUEUE_NAME, PAYMENT_QUEUE_NAME } from 'src/shared/constants/queue.constant'
import { SharePaymentRepo } from 'src/shared/repositorys/share-payment.repo'

@Processor(PAYMENT_QUEUE_NAME)
export class PaymentConsumer extends WorkerHost {
  constructor(private readonly sharePaymentRepo: SharePaymentRepo) {
    super()
  }
  async process(job: Job<{ paymentId: number }, any, string>): Promise<any> {
    switch (job.name) {
      case CANCEL_PAYMENT_QUEUE_NAME: {
        const { paymentId } = job.data
        await this.sharePaymentRepo.cancelPaymentAndOrder(paymentId)

        return {
          message: 'Payment cancelled',
        }
      }
      default: {
        break
      }
    }
  }
}
