import { createZodDto } from 'nestjs-zod'
import { EmptyModelSchema } from '../models/request.model'

export class EmptyDto extends createZodDto(EmptyModelSchema) {}
