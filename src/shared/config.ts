import { plainToInstance } from 'class-transformer'
import { validateSync } from 'class-validator'
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

class ConfigSchema {
  DATABASE_URL!: string
  ACCESS_TOKEN_SECRET!: string
  REFRESH_TOKEN_SECRET!: string
  ACCESS_TOKEN_EXPIRES_IN!: string
  REFRESH_TOKEN_EXPIRES_IN!: string
}

const configServer = plainToInstance(ConfigSchema, process.env, {
  enableCircularCheck: true,
})
const errors = validateSync(configServer)
if (errors.length > 0) {
  console.log('Invalid environment variables')
  const errorMessages = errors.map((err) => ({
    property: err.property,
    message: err.constraints,
    value: err.value,
  }))
  throw new Error(JSON.stringify(errorMessages))
}

const envConfig = configServer

export default envConfig
