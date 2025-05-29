import { Injectable } from '@nestjs/common'
import { CreateOrderBodyType, GetOrderListQueryType } from 'src/routes/order/order.model'
import { OrderRepo } from './order.repo'

@Injectable()
export class OrderService {
  constructor(private readonly orderRepo: OrderRepo) {}

  async list(userId: number, query: GetOrderListQueryType) {
    return this.orderRepo.list(userId, query)
  }
  async create(userId: number, body: CreateOrderBodyType) {
    return this.orderRepo.create(userId, body)
  }
  async detail(userId: number, orderId: number) {
    return this.orderRepo.detail(userId, orderId)
  }
  async cancel(userId: number, orderId: number) {
    return this.orderRepo.cancel(userId, orderId)
  }
}
