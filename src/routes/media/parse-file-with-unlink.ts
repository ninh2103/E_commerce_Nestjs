import { ParseFilePipe, ParseFileOptions } from '@nestjs/common'
import { unlink } from 'fs/promises'

export class ParseFileWithUnlink extends ParseFilePipe {
  constructor(options?: ParseFileOptions) {
    super(options)
  }
  async transform(files: Express.Multer.File[]) {
    return super.transform(files).catch(async (error) => {
      await Promise.all(
        files.map(async (file) => {
          await unlink(file.path)
        }),
      )
      throw error
    })
  }
}
