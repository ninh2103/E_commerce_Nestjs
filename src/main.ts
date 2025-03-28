import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { BadRequestException, ValidationPipe } from '@nestjs/common'
import { TransformInterceptor } from 'src/shared/interceptors/transform.interceptor'
async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  await app.listen(process.env.PORT ?? 3000)
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
