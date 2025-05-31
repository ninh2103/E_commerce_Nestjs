import { Injectable } from '@nestjs/common'
import { Queue } from 'bullmq'
import { InjectQueue } from '@nestjs/bullmq'
import { CANCEL_PAYMENT_QUEUE_NAME, PAYMENT_QUEUE_NAME } from 'src/shared/constants/queue.constant'
import { genarateCanclePaymentJobId } from 'src/shared/helpers'

@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {
    this.paymentQueue.getJobs().then((jobs) => {
      console.log(jobs)
    })
  }

  removeJob(paymentId: number) {
    return this.paymentQueue.remove(genarateCanclePaymentJobId(paymentId))
  }
}
