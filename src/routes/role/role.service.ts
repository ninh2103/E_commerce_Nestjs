import { BadRequestException, Injectable } from '@nestjs/common'
import { RoleRepo } from './role.repo'
import { RoleQueryType } from 'src/routes/role/role.model'
import { CreateRoleBodyType, GetRoleResType, UpdateRoleBodyType } from 'src/routes/role/role.model'
import { ProhibitedRoleException, RoleAlreadyExistsException, RoleNotFoundException } from 'src/routes/role/role.error'
import { isNotFoundPrismaError, isUniqueContraintPrismaError } from 'src/shared/helpers'
import { ROLE_NAME } from 'src/shared/constants/roleName.constant'
@Injectable()
export class RoleService {
  constructor(private readonly roleRepo: RoleRepo) {}

  async list(pagination: RoleQueryType): Promise<GetRoleResType> {
    return this.roleRepo.list(pagination)
  }

  async getById(id: number) {
    const role = await this.roleRepo.getById(id)
    if (!role) {
      throw RoleNotFoundException
    }
    return role
  }

  async create(data: CreateRoleBodyType, createdById: number) {
    try {
      const role = await this.roleRepo.create({ data, createdById })

      return role
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RoleNotFoundException
      }
      if (isUniqueContraintPrismaError(error)) {
        throw RoleAlreadyExistsException
      }
      throw error
    }
  }

  async update({ id, data, updatedById }: { id: number; data: UpdateRoleBodyType; updatedById: number }) {
    try {

      const role = await this.roleRepo.getById(id)
      if (!role) {
        throw RoleNotFoundException
      }
      
      if (role.name === ROLE_NAME.ADMIN) {
        throw ProhibitedRoleException
      }
      const updatedRole = await this.roleRepo.update({ id, data, updatedById })
      return updatedRole
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RoleNotFoundException
      }
      if (isUniqueContraintPrismaError(error)) {
        throw RoleAlreadyExistsException
      }
      if (error instanceof Error) {
        throw new BadRequestException(error.message)
      }
      throw error
    }
  }

  async delete(id: number) {
    try {
      const role = await this.roleRepo.getById(id)
      if (!role) {
        throw RoleNotFoundException
      }
      const baseRoles: string[] = [ROLE_NAME.ADMIN, ROLE_NAME.CLIENT, ROLE_NAME.SELLER]
      if (baseRoles.includes(role.name)) {
        throw ProhibitedRoleException
      }
      await this.roleRepo.delete(id)
      return {
        message: 'Role deleted successfully',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw RoleNotFoundException
      }
      throw error
    }
  }
}
