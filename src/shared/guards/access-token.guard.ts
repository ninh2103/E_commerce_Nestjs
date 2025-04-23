import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { REQUEST_ROLE_KEY, REQUEST_USER_KEY } from 'src/shared/constants/auth.constant'
import { TokenService } from '../sharedServices/token.service'
import { extractAccessToken } from 'src/shared/helpers'
import { AccessTokenPayload } from 'src/shared/types/jwt.type'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: TokenService,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()

    const decodeAccessToken = await this.extractAndValidateAccessToken(request)

    await this.validateUserPermission(decodeAccessToken, request)

    return true
  }



  private async extractAndValidateAccessToken(request: any): Promise<AccessTokenPayload> {
    const accessToken = extractAccessToken(request)

    try {
      const decodeAccessToken = await this.jwtService.verifyAccessToken(accessToken)
      request[REQUEST_USER_KEY] = decodeAccessToken
      return decodeAccessToken
    } catch (error) {
      throw new UnauthorizedException('Error.MissingAccessToken')
    }
  }

  private async validateUserPermission(decodeAccessToken: AccessTokenPayload, request: any) {
    const roleId = decodeAccessToken.roleId
    const path = request.route.path
    const method = request.method

    const role = await this.prismaService.role.findUnique({
      where: {
        id: roleId,
        deletedAt: null,
      },
      include: {
        permissions: {
          where: {
            deletedAt: null,
            path,
            method,
            
          },
        },
      },
    }).catch(() => {
      throw new ForbiddenException()
    })
    
    if (role?.permissions.length === 0) {
      throw new ForbiddenException('Error.MissingPermission')
    }

    request[REQUEST_ROLE_KEY] = role

   
    
  }
}
