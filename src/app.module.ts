import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from 'src/shared/shared.module'
import { AuthModule } from './routes/auth/auth.module'
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core'
import CustomZodValidationPipe from 'src/shared/pipes/customZodValidation.pipe'
import { ZodSerializationException } from 'nestjs-zod'
import { HttpExceptionFilter } from 'src/shared/fillters/http-exception.fillter'
import { LanguageModule } from './routes/language/language.module'
import { PermissionModule } from './routes/permission/permission.module'
import { ProfileModule } from 'src/routes/profile/profile.module'
import { UserModule } from 'src/routes/user/user.module'
import { MediaModule } from './routes/media/media.module'
import { BrandModule } from './routes/brand/brand.module'
import { BrandTranslationModule } from 'src/routes/brand/brand-translation/brand-translation.module'
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n'
import * as path from 'path'
import { CategoryModule } from 'src/routes/category/category.module'
import { CategoryTranslationModule } from 'src/routes/category/category-translation/category-translation.module'
import { ProductModule } from 'src/routes/product/product.module'
import { ProductTranslationModule } from 'src/routes/product/product-translation/product-translation.module'
import { CartModule } from 'src/routes/cart/cart.module'
import { OrderModule } from 'src/routes/order/order.module'
import { PaymentModule } from 'src/routes/payment/payment.module'
import { BullModule } from '@nestjs/bullmq'
import { PaymentConsumer } from 'src/queue/payment-cosumer'
import envConfig from 'src/shared/config'
import { RoleModule } from 'src/routes/role/role.module'
import { HealthModule } from './routes/health/health.module'
import { WebSocketModule } from 'src/webSocket/webSocket.module'

@Module({
  imports: [
    SharedModule,
    AuthModule,
    LanguageModule,
    PermissionModule,
    ProfileModule,
    UserModule,
    MediaModule,
    BrandModule,
    BrandTranslationModule,
    CategoryModule,
    CategoryTranslationModule,
    ProductModule,
    ProductTranslationModule,
    CartModule,
    RoleModule,
    OrderModule,
    PaymentModule,
    HealthModule,
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.resolve('src/i18n/'),
        watch: true,
      },
      typesOutputPath: path.resolve('src/generated/i18n.generated.ts'),
      resolvers: [{ use: QueryResolver, options: ['lang'] }, AcceptLanguageResolver],
    }),
    BullModule.forRoot({
      connection: {
        // host: 'redis-19991.crce194.ap-seast-1-1.ec2.redns.redis-cloud.com',
        // port: 19991,
        // username: 'default',
        // password: 'fxT3BJ92YiV2eRuuIt2QOn7klHIJSqMD',
        url: envConfig.REDIS_URL,
      },
    }),
    WebSocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializationException,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    PaymentConsumer,
  ],
})
export class AppModule {}
