import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({ namespace: 'payment' })
export class PaymentGateway {
  @WebSocketServer()
  server!: Server
  @SubscribeMessage('payment-success')
  handleMessage(@MessageBody() message: string): string {
    this.server.emit('payment-success', {
      data: `Hello ${message}`,
    })
    return 'success'
  }
}
