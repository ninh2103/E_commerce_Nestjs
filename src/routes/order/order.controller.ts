import { Controller, Get, Query } from '@nestjs/common'
import { OrderService } from './order.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { GetOrderListQueryDto } from 'src/routes/order/order.dto'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async list(@Query() query: GetOrderListQueryDto, @ActiveUser('userId') userId: number) {
    return this.orderService.list(userId, query)
  }
}
