import { Injectable } from '@nestjs/common'
import { GetLanguageParamsDto, UpdateLanguageBodyDto } from './language.dto'
import { LanguageRepo } from './language.repo'
import { CreateLanguageBodyDto } from 'src/routes/language/language.dto'
import { LanguageAlreadyExistsException, LanguageNotFoundException } from 'src/routes/language/language.error'
import { isNotFoundPrismaError, isUniqueContraintPrismaError } from 'src/shared/helpers'

@Injectable()
export class LanguageService {
  constructor(private readonly languageRepo: LanguageRepo) {}

  async getLanguages() {
    const languages = await this.languageRepo.findAll()
    return {
      data: languages,
      totalItems: languages.length,
    }
  }

  async getLanguageDetail(params: GetLanguageParamsDto) {
    const language = await this.languageRepo.findById(params.languageId)

    if (!language) {
      throw LanguageNotFoundException
    }

    return language
  }
  async createLanguage({ createdById, data }: { createdById: number; data: CreateLanguageBodyDto }) {
    try {
      const language = await this.languageRepo.create({
        createdById,
        data,
      })
      return language
    } catch (error) {
      if (isUniqueContraintPrismaError(error)) {
        throw LanguageAlreadyExistsException
      }
      throw error
    }
  }

  async updateLanguage({ id, data, updatedById }: { id: string; data: UpdateLanguageBodyDto; updatedById: number }) {
    try {
      const language = await this.languageRepo.update({ id, data, updatedById })
      return language
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw LanguageNotFoundException
      }
      throw error
    }
  }

  async deleteLanguage({ id }: { id: string }) {
    try {
      await this.languageRepo.delete({ id, isHardDelete: true })
      return {
        message: 'Language deleted successfully',
      }
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw LanguageNotFoundException
      }
      throw error
    }
  }
}
