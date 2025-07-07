import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { OrderService } from './order.service'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import {
  CancelOrderBodyDto,
  CreateOrderBodyDto,
  GetOrderListQueryDto,
  GetOrderParamsDto,
} from 'src/routes/order/order.dto'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  async list(@Query() query: GetOrderListQueryDto, @ActiveUser('userId') userId: number) {
    return this.orderService.list(userId, query)
  }
  @Post()
  async create(@Body() body: CreateOrderBodyDto, @ActiveUser('userId') userId: number) {
    return this.orderService.create(userId, body)
  }
  @Get(':orderId')
  async detail(@Param() params: GetOrderParamsDto, @ActiveUser('userId') userId: number) {
    return this.orderService.detail(userId, params.orderId)
  }
  @Put(':orderId')
  async cancel(
    @Param() params: GetOrderParamsDto,
    @Body() _: CancelOrderBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.orderService.cancel(userId, params.orderId)
  }
  @Put('/changestatus/:orderId')
  async changeStatus(
    @Param() params: GetOrderParamsDto,
    @Body() _: CancelOrderBodyDto,
    @ActiveUser('userId') userId: number,
    @ActiveUser() user: AccessTokenPayload,
  ) {
    return this.orderService.changeStatusOrder({ orderId: params.orderId, userId: userId, roleName: user.roleName })
  }
}
