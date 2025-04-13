import { Prisma } from '@prisma/client'
import { randomInt } from 'crypto'

export function isUniqueContraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export const genareteCode = () => {
  return String(randomInt(100000, 999999))
}
