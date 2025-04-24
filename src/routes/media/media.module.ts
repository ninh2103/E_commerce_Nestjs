import { Module } from '@nestjs/common'
import { MediaController } from './media.controller'
import { MulterModule } from '@nestjs/platform-express'
import multer from 'multer'
import { generateRandomFileName, uploadDir } from '../../shared/helpers'
import { existsSync, mkdirSync } from 'fs'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const newFileName = generateRandomFileName(file.originalname)
    cb(null, newFileName)
  },
})

@Module({
  controllers: [MediaController],
  imports: [
    MulterModule.register({
      storage,
    }),
  ],
})
export class MediaModule {
  constructor() {
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }
  }
}
