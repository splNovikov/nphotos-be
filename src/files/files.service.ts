import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { extname } from 'path';
import * as sharp from 'sharp';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';

import { s3, s3Params } from './s3.config';

// todo: delete file from s3
// todo: dateUploaded to Mongo
// todo: show "upload progress bar"
@Injectable()
export class FilesService {
  // todo: any?!
  public async imagesUpload(@UploadedFiles() files): Promise<any> {
    if (!files || !files.length) {
      return new HttpException(
        `Your request is missing details. No files to upload`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // todo: check for type firstly
    const sharpedFile = await this.sharpImage(files[0]);

    // todo: all files
    // todo: figure out how to upload by 3 files in time
    return this.s3Upload({ ...files[0], buffer: sharpedFile });
  }

  // todo: return type
  private async sharpImage(@UploadedFile() file) {
    return sharp(file.buffer)
      .resize(10, 100);
  }

  private async s3Upload(
    @UploadedFile() file,
  ): Promise<ManagedUpload.SendData> {
    try {
      return new Promise((resolve, reject) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return reject(
            new HttpException(
              `Unsupported file type ${extname(file.originalname)}`,
              HttpStatus.BAD_REQUEST,
            ),
          );
        }

        return s3.upload(
          s3Params({
            key: `${Date.now().toString()}-${file.originalname}`,
            file,
          }),
          (error, data) => (error ? reject(error) : resolve(data)),
        );
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
