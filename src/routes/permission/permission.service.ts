import { Injectable } from '@nestjs/common'
import { PermissionAlreadyExistsException, PermissionNotFoundException } from 'src/routes/permission/permission.erorr'
import {
  CreatePermissionBodyType,
  GetPermissionResType,
  PermissionQueryType,
  PermissionType,
  UpdatePermissionBodyType,
} from 'src/routes/permission/permission.model'
import { PermissionRepo } from 'src/routes/permission/permission.repo'
import { isNotFoundPrismaError, isUniqueContraintPrismaError } from 'src/shared/helpers'

@Injectable()
export class PermissionService {
  constructor(private readonly permissionRepo: PermissionRepo) {}

  async list(pagination: PermissionQueryType): Promise<GetPermissionResType> {
    return this.permissionRepo.list(pagination)
  }

  async getById(id: number): Promise<PermissionType> {
    const permission = await this.permissionRepo.findById(id)
    if (!permission) {
      throw PermissionNotFoundException
    }
    return permission
  }

  async create({
    data,
    createdById,
  }: {
    data: CreatePermissionBodyType
    createdById: number
  }): Promise<PermissionType> {
    try {
      const permission = await this.permissionRepo.create({
        data,
        createdById,
      })
      return permission
    } catch (error) {
      if (isUniqueContraintPrismaError(error)) {
        throw PermissionAlreadyExistsException
      }
      throw error
    }
  }
  async update({
    id,
    data,
    updatedById,
  }: {
    id: number
    data: UpdatePermissionBodyType
    updatedById: number
  }): Promise<PermissionType> {
    try {
      const permission = await this.permissionRepo.update({ id, data, updatedById })
      if (!permission) {
        throw PermissionAlreadyExistsException
      }
      return permission
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw PermissionNotFoundException
      }
      if (isUniqueContraintPrismaError(error)) {
        throw PermissionAlreadyExistsException
      }
      throw error
    }
  }
  async delete(id: number) {
    try {
      await this.permissionRepo.delete(id)
      return {
        message: 'Permission deleted successfully',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw PermissionNotFoundException
      }
      throw error
    }
  }
}
