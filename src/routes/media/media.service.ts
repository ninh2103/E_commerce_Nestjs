import { Injectable } from '@nestjs/common'
import { unlink } from 'fs/promises'
import {
  PresignedUploadFileBodyType,
  PresignedUploadFileResponseType,
  PresignedUploadFileResType,
} from 'src/routes/media/media.model'
import { generateRandomFileName } from 'src/shared/helpers'
import { S3Service } from 'src/shared/sharedServices/s3.service'

@Injectable()
export class MediaService {
  constructor(private readonly s3Service: S3Service) {}
  async uploadFile(files: Express.Multer.File[]): Promise<PresignedUploadFileResponseType> {
    const result = Promise.all(
      files.map(async (file) => {
        return this.s3Service
          .uploadFile({
            fileName: 'images/' + file.filename,
            filePath: file.path,
            contentType: file.mimetype,
          })
          .then((result) => {
            if (!result.Location) {
              throw new Error('Failed to get file location from S3')
            }
            return {
              url: result.Location,
            }
          })
      }),
    )
    await Promise.all(
      files.map(async (file) => {
        await unlink(file.path)
      }),
    )

    return { data: await result }
  }

  async createPresignedUrl(body: PresignedUploadFileBodyType): Promise<PresignedUploadFileResType> {
    const randomFileName = generateRandomFileName(body.filename)
    const presignedUrl = await this.s3Service.createPresignedUrlwithClient(randomFileName)
    const url = presignedUrl.split('?')[0]
    return {
      presignedUrl,
      url,
    }
  }
}
