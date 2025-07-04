import { INestApplicationContext } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import e from 'express'
import { createClient } from 'redis'
import { ServerOptions, Server, Socket } from 'socket.io'
import envConfig from 'src/shared/config'
import { genarateRoomUserId } from 'src/shared/helpers'
import { ShareWebSocketRepository } from 'src/shared/repositorys/share-webSocket.repo'
import { TokenService } from 'src/shared/sharedServices/token.service'

export class WebSocketAdaptor extends IoAdapter {
  private readonly shareWebSocketRepo: ShareWebSocketRepository
  private readonly tokenService: TokenService
  private adapterConstructor!: ReturnType<typeof createAdapter>

  constructor(app: INestApplicationContext) {
    super(app)
    this.shareWebSocketRepo = app.get(ShareWebSocketRepository)
    this.tokenService = app.get(TokenService)
  }

  async connectToRedis(): Promise<void> {
    const pubClient = createClient({ url: envConfig.REDIS_URL })
    const subClient = pubClient.duplicate()

    await Promise.all([pubClient.connect(), subClient.connect()])

    this.adapterConstructor = createAdapter(pubClient, subClient)
  }
  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: '*',
        credentials: true,
      },
    })
    server.use((socket, next) => {
      this.authMiddleware(socket, next)
    })
    server.of(/.*/).use((socket, next) => {
      this.authMiddleware(socket, next)
    })
    return server
  }

  async authMiddleware(socket: Socket, next: (err?: any) => void) {
    const { authorization } = socket.handshake.headers
    if (!authorization) {
      return next(new Error('Không có Authorization'))
    }
    const accessToken = authorization.split(' ')[1]
    if (!accessToken) {
      return next(new Error('Không có accessToken'))
    }

    try {
      const { userId } = await this.tokenService.verifyAccessToken(accessToken)
      await socket.join(genarateRoomUserId(userId))
      // await this.shareWebSocketRepo.create({
      //   id: socket.id,
      //   userId,
      // })
      // next()
      // socket.on('disconnect', async () => {
      //   await this.shareWebSocketRepo.delete(socket.id)
      // })
      next()
    } catch (error) {
      next(error)
    }
  }
}
