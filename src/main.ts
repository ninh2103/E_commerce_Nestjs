import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor'
async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log', 'debug', 'verbose'] })
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
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
