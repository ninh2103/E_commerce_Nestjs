import { Module } from '@nestjs/common'
import { ChatGateway } from './chat.getway'
import { PaymentGateway } from 'src/webSocket/payment.getway'

@Module({
  imports: [],
  controllers: [],
  providers: [ChatGateway, PaymentGateway],
})
export class WebSocketModule {}
