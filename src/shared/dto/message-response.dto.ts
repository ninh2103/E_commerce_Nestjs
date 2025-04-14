import { MessageResponseSchema } from '../models/message-response.model'
import { createZodDto } from 'nestjs-zod'

export class MessageResponseDto extends createZodDto(MessageResponseSchema) {}
