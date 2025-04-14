import { Injectable } from '@nestjs/common'
import { hash, compare } from 'bcrypt'

const SALT_ROUNDS = 10

@Injectable()
export class HashingService {
  hash(value: string) {
    return hash(value, SALT_ROUNDS)
  }

  compare(value: string, hash: string) {
    return compare(value, hash)
  }
}
