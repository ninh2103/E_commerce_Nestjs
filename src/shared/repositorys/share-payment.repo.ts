import { Injectable, NotFoundException } from '@nestjs/common'
import { OrderStatus } from 'src/shared/constants/order.constant'
import { PaymentStatus } from 'src/shared/constants/payment.contant'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class SharePaymentRepo {
  constructor(private readonly prisma: PrismaService) {}

  async cancelPaymentAndOrder(paymentId: number) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: {
          include: {
            snapshots: true,
          },
        },
      },
    })
    if (!payment) {
      throw new NotFoundException('Payment not found')
    }
    const { order } = payment

    const productSkuSnapshots = order.map((order) => order.snapshots).flat()

    await this.prisma.$transaction(async (tx) => {
      const update$ = await tx.order.updateMany({
        where: { id: { in: order.map((order) => order.id) }, status: OrderStatus.PENDING_PAYMENT, deletedAt: null },
        data: { status: OrderStatus.CANCELLED },
      })

      const updateSkus$ = Promise.all(
        productSkuSnapshots
          .filter((snapshot) => snapshot.skuId)
          .map((snapshot) =>
            tx.sKU.update({
              where: { id: snapshot.skuId },
              data: {
                stock: {
                  increment: snapshot.quantity,
                },
              },
            }),
          ),
      )
      const updatePayment$ = tx.payment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.FAILED },
      })

      return await Promise.all([update$, updateSkus$, updatePayment$])
    })
  }
}
