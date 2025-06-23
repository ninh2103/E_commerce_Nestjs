import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService, HealthIndicatorStatus } from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => ({
        app: {
          status: 'up' as HealthIndicatorStatus,
          timestamp: new Date().toISOString(),
        },
      }),
    ])
  }
}
