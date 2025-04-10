import { createZodValidationPipe, ZodValidationPipe } from 'nestjs-zod'
import { ZodError } from 'zod'
import { UnprocessableEntityException } from '@nestjs/common'

const CustomZodValidationPipe = createZodValidationPipe({
  createValidationException: (errors: ZodError) => {
    return new UnprocessableEntityException(
      errors.errors.map((error) => {
        return {
          ...error,
          path: error.path.join('.'),
          message: error.message,
        }
      }),
    )
  },
})

export default CustomZodValidationPipe
