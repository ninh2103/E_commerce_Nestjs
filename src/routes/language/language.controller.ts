import { Body, Controller, Delete, Get, Param, Post, Put, Req } from '@nestjs/common'
import { ZodSerializerDto } from 'nestjs-zod'
import { LanguageService } from 'src/routes/language/language.service'
import { CreateLanguageBodyDto, GetLanguageParamsDto, UpdateLanguageBodyDto } from './language.dto'
import { ActiveUser } from 'src/shared/decorators/active-user.decorator'
import { MessageResponseDto } from 'src/shared/dto/message-response.dto'
@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @Post()
  @ZodSerializerDto(CreateLanguageBodyDto)
  createLanguage(@Body() body: CreateLanguageBodyDto, @ActiveUser('userId') userId: number) {
    return this.languageService.createLanguage({ createdById: userId, data: body })
  }

  @Get()
  getLanguages() {
    return this.languageService.getLanguages()
  }

  @Get(':languageId')
  @ZodSerializerDto(GetLanguageParamsDto)
  getLanguageDetail(@Param() params: GetLanguageParamsDto) {
    return this.languageService.getLanguageDetail({ languageId: params.languageId })
  }

  @Put(':languageId')
  @ZodSerializerDto(UpdateLanguageBodyDto)
  updateLanguage(
    @Param() params: GetLanguageParamsDto,
    @Body() body: UpdateLanguageBodyDto,
    @ActiveUser('userId') userId: number,
  ) {
    return this.languageService.updateLanguage({ id: params.languageId, data: body, updatedById: userId })
  }

  @Delete(':languageId')
  @ZodSerializerDto(MessageResponseDto)
  deleteLanguage(@Param() params: GetLanguageParamsDto) {
    return this.languageService.deleteLanguage({ id: params.languageId })
  }
}
