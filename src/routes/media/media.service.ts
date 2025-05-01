import { Injectable } from '@nestjs/common'
import { unlink } from 'fs/promises'
import { generateRandomFileName } from 'src/shared/helpers'
import { S3Service } from 'src/shared/sharedServices/s3.service'

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}
  async uploadFile(files: Express.Multer.File[]) {
    const result = Promise.all(
      files.map(async (file) => {
        return this.s3Service
          .uploadFile({
            fileName: 'images/' + file.filename,
            filePath: file.path,
            contentType: file.mimetype,
          })
          .then((result) => {
            return {
              result: { url: result.Location },
            }
          })
      }),
    )
    await Promise.all(
      files.map(async (file) => {
        await unlink(file.path)
      }),
    )

    return result
  }

  async createPresignedUrl(body: { fileName: string }) {
    const randomFileName = generateRandomFileName(body.fileName)
    const presignedUrl = await this.s3Service.createPresignedUrlwithClient(randomFileName)
    const url = presignedUrl.split('?')[0]
    return {
      result: { presignedUrl, url: url },
    }
  }
}
