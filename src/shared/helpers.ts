import { UnauthorizedException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { randomInt } from 'crypto'
import path from 'path'
import { v4 as uuidv4 } from 'uuid'

export function isUniqueContraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export function isNotFoundPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025'
}

export function isForeignKeyConstraintPrismaError(error: any): error is Prisma.PrismaClientKnownRequestError {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003'
}

export const genareteCode = () => {
  return String(randomInt(100000, 999999))
}

export function extractAccessToken(request: any): string {
  const authHeader = request.headers.authorization
  if (!authHeader || typeof authHeader !== 'string') {
    throw new UnauthorizedException('Missing Authorization header')
  }

  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new UnauthorizedException('Invalid Authorization header format')
  }

  return parts[1]
}

export function generateRandomFileName(fileName: string): string {
  const ext = path.extname(fileName)
  return `${uuidv4()}${ext}`
}

export const uploadDir = path.resolve('uploads')
