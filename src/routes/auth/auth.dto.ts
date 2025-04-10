import { z } from 'zod'
import { createZodDto } from 'nestjs-zod'

const RegisterBodySchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
    confirmPassword: z.string().min(8),
    phoneNumber: z.string().min(10),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export class RegisterBodyDto extends createZodDto(RegisterBodySchema) {}
