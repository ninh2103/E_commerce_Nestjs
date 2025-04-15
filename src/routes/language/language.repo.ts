import { Injectable } from '@nestjs/common'
import { CreateLanguageBodyType, LanguageType, UpdateLanguageBodyType } from 'src/routes/language/language.model'
import { PrismaService } from 'src/shared/sharedServices/prisma.service'

@Injectable()
export class LanguageRepo {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.language.findMany({ where: { deletedAt: null } })
  }

  findById(id: string): Promise<LanguageType | null> {
    return this.prisma.language.findUnique({ where: { id, deletedAt: null } })
  }

  create({ createdById, data }: { createdById: number; data: CreateLanguageBodyType }): Promise<LanguageType> {
    return this.prisma.language.create({ data: { ...data, createdById } })
  }

  update({
    id,
    data,
    updatedById,
  }: {
    id: string
    data: UpdateLanguageBodyType
    updatedById: number
  }): Promise<LanguageType> {
    return this.prisma.language.update({ where: { id, deletedAt: null }, data: { ...data, updatedById } })
  }

  delete({ id, isHardDelete }: { id: string; isHardDelete: boolean }): Promise<LanguageType> {
    if (isHardDelete) {
      return this.prisma.language.delete({ where: { id, deletedAt: null } })
    }
    return this.prisma.language.update({ where: { id, deletedAt: null }, data: { deletedAt: new Date() } })
  }
}
