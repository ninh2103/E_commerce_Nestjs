import { Injectable } from '@nestjs/common'
import { PaymentRepo } from './payment.repo'
import { WebhookPaymentBodyType } from 'src/routes/payment/payment.model'
import { ShareWebSocketRepository } from 'src/shared/repositorys/share-webSocket.repo'
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'
import { genarateRoomUserId } from 'src/shared/helpers'

@Injectable()
@WebSocketGateway({ namespace: 'payment' })
export class PaymentService {
  @WebSocketServer()
  server!: Server
  constructor(
    private readonly paymentRepo: PaymentRepo,
    private readonly shareWebsocketRepo: ShareWebSocketRepository,
  ) {}

  async receivePayment(body: WebhookPaymentBodyType) {
    const userId = await this.paymentRepo.receivePayment(body)
    this.server.to(genarateRoomUserId(userId)).emit('payment', {
      status: 'success',
    })
    // try {
    //   const webSockets = await this.shareWebsocketRepo.findAll(userId)
    //   webSockets.forEach((ws) => {
    //     this.server.to(ws.id).emit('payment', {
    //       status: 'success',
    //     })
    //   })
    // } catch (error) {
    //   console.log(error)
    // }
    return {
      message: 'Payment successfully',
    }
  }
}
