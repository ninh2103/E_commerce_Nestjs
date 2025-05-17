import { ForbiddenException, Injectable } from '@nestjs/common'
import { I18nContext } from 'nestjs-i18n'
import { ProductNotFoundException } from 'src/routes/product/product.error'
import {
  CreateProductBodyType,
  GetManageProductsQueryType,
  GetProductsQueryType,
  UpdateProductBodyType,
} from 'src/routes/product/product.model'
import { ProductRepo } from 'src/routes/product/product.repo'
import { ROLE_NAME } from 'src/shared/constants/roleName.constant'
import { isNotFoundPrismaError } from 'src/shared/helpers'

@Injectable()
export class ManageProductService {
  constructor(private readonly productRepo: ProductRepo) {}

  validatePrivilege({
    userIdRequest,
    createdById,
    roleNameRequest,
  }: {
    userIdRequest: number
    createdById: number | undefined | null
    roleNameRequest: string
  }) {
    if (userIdRequest !== createdById && roleNameRequest !== ROLE_NAME.ADMIN) {
      throw new ForbiddenException('You are not allowed to access this resource')
    }
    return true
  }
  async list(props: { query: GetManageProductsQueryType; userIdRequest: number; roleNameRequest: string }) {
    this.validatePrivilege({
      userIdRequest: props.userIdRequest,
      createdById: props.query.createdById,
      roleNameRequest: props.roleNameRequest,
    })
    const products = await this.productRepo.list({
      page: props.query.page,
      limit: props.query.limit,
      languageId: I18nContext.current()?.lang as string,
      createdById: props.query.createdById,
      isPublic: props.query.isPublic,
    })
    return products
  }

  async getDetail(props: { productId: number; userIdRequest: number; roleNameRequest: string }) {
    const product = await this.productRepo.getDetail({
      productId: props.productId,
      languageId: I18nContext.current()?.lang as string,
    })
    if (!product) {
      throw ProductNotFoundException
    }
    this.validatePrivilege({
      userIdRequest: props.userIdRequest,
      createdById: product.createdById,
      roleNameRequest: props.roleNameRequest,
    })
    return product
  }

  async create({ createdById, data }: { createdById: number; data: CreateProductBodyType }) {
    return await this.productRepo.create({ createdById, data })
  }

  async update({
    productId,
    updatedById,
    data,
    roleNameRequest,
  }: {
    productId: number
    updatedById: number
    data: UpdateProductBodyType
    roleNameRequest: string
  }) {
    const product = await this.productRepo.findById(productId)
    if (!product) {
      throw ProductNotFoundException
    }
    this.validatePrivilege({
      userIdRequest: updatedById,
      createdById: product.createdById,
      roleNameRequest: roleNameRequest,
    })

    try {
      const updatedProduct = await this.productRepo.update({ id: productId, updatedById, data })
      return updatedProduct
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException
      }
      throw error
    }
  }

  async delete(productId: number, roleNameRequest: string, userIdRequest: number) {
    const product = await this.productRepo.findById(productId)
    if (!product) {
      throw ProductNotFoundException
    }

    this.validatePrivilege({
      userIdRequest: userIdRequest,
      createdById: product.createdById,
      roleNameRequest: roleNameRequest,
    })
    try {
      await this.productRepo.delete(productId)
      return { message: 'Product deleted successfully' }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw ProductNotFoundException
      }
      throw error
    }
  }
}
