import { Injectable } from '@nestjs/common'
import { CreateOrderBodyType, GetOrderListQueryType } from 'src/routes/order/order.model'
import { OrderRepo } from './order.repo'
import { OrderProducer } from 'src/routes/order/order.producer'

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepo,
    private readonly orderProducer: OrderProducer,
  ) {}

  async list(userId: number, query: GetOrderListQueryType) {
    return await this.orderRepo.list(userId, query)
  }
  async create(userId: number, body: CreateOrderBodyType) {
    const result = await this.orderRepo.create(userId, body)
    await this.orderProducer.cancelPayment(result.paymentId)
    return {
      data: result.orders,
    }
  }
  async detail(userId: number, orderId: number) {
    return this.orderRepo.detail(userId, orderId)
  }
  async cancel(userId: number, orderId: number) {
    return this.orderRepo.cancel(userId, orderId)
  }
}
