import { createZodDto } from 'nestjs-zod'
import { EmptyModelSchema } from '../models/request.model'

export class EmptyDtoBody extends createZodDto(EmptyModelSchema) {}
