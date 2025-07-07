import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class CronjobRemoveRefreshToken {
  constructor(private readonly Prisma: PrismaService) {}
  private readonly logger = new Logger(CronjobRemoveRefreshToken.name)

  @Cron(CronExpression.EVERY_DAY_AT_10AM)
  async handleCron() {
    this.logger.debug('Called when the current EVERY_DAY_AT_10AM')
    await this.Prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    })
  }
}
