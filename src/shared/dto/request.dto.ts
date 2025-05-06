import { createZodDto } from 'nestjs-zod'
import { EmptyModelSchema, PaginationSchema } from '../models/request.model'

export class EmptyDtoBody extends createZodDto(EmptyModelSchema) {}

export class PaginationDto extends createZodDto(PaginationSchema) {}
