import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor'
import { WebSocketAdaptor } from 'src/webSocket/webSocket.adapter'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
import { NestExpressApplication } from '@nestjs/platform-express'
import helmet from 'helmet'
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  })
  app.set('trust proxy', 'loopback')
  app.use(helmet())
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('Ecommerc API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        name: 'payment-api-key',
        type: 'apiKey',
      },
      'payment-api-key',
    )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
  patchNestJsSwagger()
  const redisIoAdapter = new WebSocketAdaptor(app)
  await redisIoAdapter.connectToRedis()
  app.useWebSocketAdapter(redisIoAdapter)
  await app.listen(process.env.PORT ?? 4000)
  app.useGlobalInterceptors(new TransformInterceptor())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (validationErrors) => {
        return new BadRequestException({
          message: validationErrors.map((error) => ({
            field: error.property,
            errors: Object.values(error.constraints || {}),
          })),
        })
      },
    }),
  )
}
bootstrap()
