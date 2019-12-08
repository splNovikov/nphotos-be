import {
  Injectable,
  BadRequestException,
  UploadedFiles,
  UploadedFile,
} from '@nestjs/common';
import { extname } from 'path';
import * as sharp from 'sharp';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';

import { s3, s3Params } from './s3.config';
import { fetchData } from '../utils/multiPromises';

// todo: move to env variables
const AWS_UPLOAD_LIMIT = 5;

// todo: delete file from s3
// todo: dateUploaded to Mongo
// todo: show "upload progress bar"
@Injectable()
export class FilesService {
  // todo: any?!
  public async imagesUpload(@UploadedFiles() files): Promise<any> {
    if (!files || !files.length) {
      return new BadRequestException(
        'Your request is missing details. No files to upload',
      );
    }

    return fetchData(this, files, this.processImage, AWS_UPLOAD_LIMIT);
  }

  private async processImage(
    @UploadedFile() file,
  ): Promise<ManagedUpload.SendData> {
    return new Promise(async (resolve, reject) => {
      // todo: mimetypes also move to env variables
      // 1. Validate image:
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return reject(
          new BadRequestException(
            `Unsupported file type ${extname(file.originalname)}`,
          ),
        );
      }

      // 2. Resize image:
      let sharpedFile;

      try {
        sharpedFile = await this.sharpImage(file);
      } catch (e) {
        return reject(new BadRequestException(e.message));
      }

      // 3. Upload to s3:
      let result;

      try {
        result = await this.s3Upload({ ...file, buffer: sharpedFile });
      } catch (e) {
        return reject(new BadRequestException(e.message));
      }

      return resolve(result);
    });
  }

  private async sharpImage(@UploadedFile() file): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      return (
        sharp(file.buffer)
          // todo: all configure params move to env variables
          .resize(100, 100)
          .toBuffer()
          .then(data => {
            resolve(data);
          })
          .catch(err => {
            reject(err);
          })
      );
    });
  }

  private async s3Upload(
    @UploadedFile() file,
  ): Promise<ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {
      return s3.upload(
        s3Params({
          key: `${Date.now().toString()}-${file.originalname}`,
          file,
        }),
        (error, data) => (error ? reject(error) : resolve(data)),
      );
    });
  }
}
