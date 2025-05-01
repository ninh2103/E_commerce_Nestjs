import {
  Body,
  Get,
  MaxFileSizeValidator,
  NotFoundException,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import path from 'path'
import { MediaService } from 'src/routes/media/media.service'
import envConfig from 'src/shared/config'
import { IsPublic } from 'src/shared/decorators/auth.decorator'
import { uploadDir } from 'src/shared/helpers'
import { S3Service } from 'src/shared/sharedServices/s3.service'
@Controller('upload')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}
  @Post('images')
  @UseInterceptors(
    FilesInterceptor('files', 100, {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  uploadFile(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.mediaService.uploadFile(files)
  }

  @Get('static/:filename')
  @IsPublic()
  serveFile(@Param('filename') filename: string, @Res() res: Response) {
    return res.sendFile(path.join(uploadDir, filename), (err) => {
      if (err) {
        const notFound = new NotFoundException('File not found')
        res.status(notFound.getStatus()).json(notFound.getResponse())
      }
    })
  }
  @Post('presigned-url')
  @IsPublic()
  createPresignedUrl(@Body() body: { fileName: string }) {
    return this.mediaService.createPresignedUrl(body)
  }
}
