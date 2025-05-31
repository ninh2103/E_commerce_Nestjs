import z from 'zod'
import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'

config({
  path: '.env',
})

if (!fs.existsSync(path.resolve('.env'))) {
  throw new Error('No .env file found')
  process.exit(1)
}

const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  ACCESS_TOKEN_EXPIRES_IN: z.string(),
  REFRESH_TOKEN_EXPIRES_IN: z.string(),
  SECRET_KEY: z.string(),
  PAYMENT_API_KEY: z.string(),
  ADMIN_NAME: z.string(),
  ADMIN_EMAIL: z.string(),
  ADMIN_PASSWORD: z.string(),
  ADMIN_PHONE_NUMBER: z.string(),
  VERIFICATION_CODE_EXPIRES_IN: z.string(),
  API_KEY: z.string(),
  PREFIX_STATIC_ENDPOINT: z.string(),
  S3_REGION: z.string(),
  S3_ACCESS_KEY: z.string(),
  S3_SECRET_KEY: z.string(),
  S3_BUCKET_NAME: z.string(),
  REDIS_URL: z.string(),
})

const configServer = ConfigSchema.parse(process.env)

if (!configServer) {
  console.log('Invalid environment variables')
  throw new Error('Invalid environment variables')
  process.exit(1)
}

const envConfig = configServer

export default envConfig
