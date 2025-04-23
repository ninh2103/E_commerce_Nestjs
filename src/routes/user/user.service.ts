import { ForbiddenException, Injectable } from '@nestjs/common'
import { UserRepository } from './user.repo'
import { CreateUserBodyType, GetUserQueryType, UpdateUserBodyType } from 'src/routes/user/user.model'
import {
  CannotUpdateYourselfException,
  RoleNotFoundException,
  UserAlreadyExistsException,
  UserNotFoundException,
} from 'src/routes/user/error.user'
import { SharedRepository } from 'src/shared/repositorys/shared.repo'
import { ROLE_NAME } from 'src/shared/constants/roleName.constant'
import { ShareRoleRepository } from 'src/shared/repositorys/share-role.repo'
import { HashingService } from 'src/shared/sharedServices/hashing.service'
import {
  isForeignKeyConstraintPrismaError,
  isNotFoundPrismaError,
  isUniqueContraintPrismaError,
} from 'src/shared/helpers'
import { NotFoundRecordException } from 'src/routes/profile/error.profile'
@Injectable()
export class UserService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly sharedRepo: SharedRepository,
    private readonly shareRoleRepo: ShareRoleRepository,
    private readonly hashingService: HashingService,
  ) {}

  private async verifyRole({ roleNameAgent, roleIdAgent }: { roleNameAgent: string; roleIdAgent: number }) {
    if (roleNameAgent === ROLE_NAME.ADMIN) {
      return true
    } else {
      const adminRoleId = await this.shareRoleRepo.getAdminRoleId()
      if (roleIdAgent === adminRoleId) {
        throw new ForbiddenException()
      }
      return true
    }
  }

  async list(pagination: GetUserQueryType) {
    return this.userRepo.list(pagination)
  }

  async findById(id: number) {
    const user = await this.sharedRepo.findUniqueUniqueRolePermission({ id, deletedAt: null })
    if (!user) {
      throw UserNotFoundException
    }
    return user
  }

  async create({
    data,
    createdById,
    createByRoleName,
  }: {
    data: CreateUserBodyType
    createdById: number
    createByRoleName: string
  }) {
    try {
      await this.verifyRole({ roleNameAgent: createByRoleName, roleIdAgent: data.roleId })

      const hashedPassword = await this.hashingService.hash(data.password)

      const user = await this.userRepo.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        createdById,
      })

      return user
    } catch (error) {
      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException
      }

      if (isUniqueContraintPrismaError(error)) {
        throw UserAlreadyExistsException
      }
      throw error
    }
  }

  async update({
    id,
    data,
    updatedById,
    updatedByRoleName,
  }: {
    id: number
    data: UpdateUserBodyType
    updatedById: number
    updatedByRoleName: string
  }) {
    try {
      if (id === updatedById) {
        throw CannotUpdateYourselfException
      }
      const currentUser = await this.sharedRepo.findUnique({ id: updatedById, deletedAt: null })
      if (!currentUser) {
        throw NotFoundRecordException
      }

      const roleIdTarget = currentUser.roleId

      await this.verifyRole({ roleNameAgent: updatedByRoleName, roleIdAgent: roleIdTarget })

      const updatedUser = await this.userRepo.update(id, data, updatedById)

      return updatedUser
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      if (isUniqueContraintPrismaError(error)) {
        throw UserAlreadyExistsException
      }

      if (isForeignKeyConstraintPrismaError(error)) {
        throw RoleNotFoundException
      }
      throw error
    }
  }
  async delete({ id, deletedByRoleName }: { id: number; deletedByRoleName: string }) {
    try {
      const currentUser = await this.sharedRepo.findUnique({ id, deletedAt: null })
      if (!currentUser) {
        throw NotFoundRecordException
      }

      await this.verifyRole({ roleNameAgent: deletedByRoleName, roleIdAgent: currentUser.roleId })

      await this.userRepo.delete(id)

      return {
        message: 'User deleted successfully',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw NotFoundRecordException
      }
      throw error
    }
  }
}
