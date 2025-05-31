import { BadRequestException, Injectable } from '@nestjs/common'
import { parse } from 'date-fns'
import { OrderIncludeProductSkuSnapshotType } from 'src/routes/order/order.model'
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model'
import { PaymentProducer } from 'src/routes/payment/payment.producer'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { PAYMENT_PREFIX } from 'src/shared/constants/orther.constant'
import { PaymentStatus } from 'src/shared/constants/payment.contant'
import { MessageResponseType } from 'src/shared/models/message-response.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class PaymentRepo {
  constructor(
    private prisma: PrismaService,
    private readonly paymentProducer: PaymentProducer,
  ) {}
  async getTotalPrice(orders: OrderIncludeProductSkuSnapshotType[]): Promise<number> {
    return orders.reduce((total, order) => {
      const orderTotal = order.snapshots.reduce((total, snapshot) => {
        return total + snapshot.skuPrice * snapshot.quantity
      }, 0)
      return total + orderTotal
    }, 0)
  }

  async receivePayment(body: WebhookPaymentBodyType): Promise<MessageResponseType> {
    let amountIn = 0
    let amountOut = 0
    if (body.transferType === 'in') {
      amountIn = body.transferAmount
    } else {
      amountOut = body.transferAmount
    }

    const paymentTransaction = await this.prisma.paymentTransaction.findUnique({
      where: {
        id: body.id,
      },
    })
    if (paymentTransaction) {
      throw new BadRequestException('Payment transaction already exists')
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.paymentTransaction.create({
        data: {
          id: body.id,
          gateway: body.gateway,
          transactionDate: parse(body.transactionDate, 'yyyy-MM-dd HH:mm:ss', new Date()),
          accountNumber: body.accountNumber,
          code: body.code,
          transactionContent: body.content,
          amountIn: amountIn,
          amountOut: amountOut,
          accumulated: body.accumulated,
          subAccount: body.subAccount,
          referenceNumber: body.referenceCode,
          body: body.description,
        },
      })

      const paymentId = body.code
        ? Number(body.code.split(PAYMENT_PREFIX)[1])
        : Number(body.content?.split(PAYMENT_PREFIX)[1])
      if (isNaN(paymentId)) {
        throw new BadRequestException('Invalid payment id')
      }
      const payment = await tx.payment.findUnique({
        where: {
          id: paymentId,
        },
        include: {
          order: {
            include: {
              snapshots: true,
            },
          },
        },
      })
      if (!payment) {
        throw new BadRequestException('Payment not found')
      }
      const { order } = payment
      const totalPrice = await this.getTotalPrice(order)
      if (totalPrice !== body.transferAmount) {
        throw new BadRequestException('Invalid payment amount')
      }
      await Promise.all([
        tx.payment.update({
          where: { id: paymentId },
          data: { status: PaymentStatus.SUCCESS },
        }),
        tx.order.updateMany({
          where: { id: { in: order.map((order) => order.id) } },
          data: { status: OrderStatus.PENDING_PICKUP },
        }),
        this.paymentProducer.removeJob(paymentId),
      ])
    })
    return {
      message: 'Payment received successfully',
    }
  }
}
