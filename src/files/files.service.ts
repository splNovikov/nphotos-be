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
import { simultaneousPromises } from '../utils/multiPromises';

// todo: move AWS_UPLOAD_LIMIT, IMAGE_MIME_TYPES to env variables in heroku
const { AWS_UPLOAD_LIMIT, IMAGE_MIME_TYPES } = process.env;
const imagesUploadLimit = +AWS_UPLOAD_LIMIT;
const imagesMimeRegex = new RegExp(IMAGE_MIME_TYPES);

// todo: delete file from s3
// todo: uploadedDate to Mongo
// todo: show "upload progress bar"
@Injectable()
export class FilesService {
  public async imagesUpload(
    @UploadedFiles() files,
  ): Promise<Array<{ previewPath; path }>> {
    if (!files || !files.length) {
      throw new BadRequestException(
        'Your request is missing details. No files to upload',
      );
    }

    return simultaneousPromises(
      files,
      this.processImage.bind(this),
      imagesUploadLimit,
    );
  }

  private async processImage(
    @UploadedFile() file,
  ): Promise<{ previewPath; path }> {
    return new Promise(async (resolve, reject) => {
      // 1. Validate image:
      if (!file.mimetype.match(imagesMimeRegex)) {
        return reject(
          new BadRequestException(
            `Unsupported file type ${extname(file.originalname)}`,
          ),
        );
      }

      // 2. Resize image:
      // todo: move 100 and 1000 to env.variables
      const resizedImages = await simultaneousPromises(
        [
          { file, size: { width: 100, height: 100 } },
          {
            file,
            size: {
              width: 1000,
              height: 1000,
            },
          },
        ],
        this.sharpImage,
        2,
      );

      // 3. Upload to s3:
      let result;

      try {
        // todo: rename simultaneousPromises to simultaneousPromises
        result = await simultaneousPromises(
          [
            { ...file, buffer: resizedImages[0] },
            { ...file, buffer: resizedImages[1] },
          ],
          this.s3Upload,
          2,
        );
      } catch (e) {
        return reject(new BadRequestException(e.message));
      }

      return resolve({
        previewPath: result[0].Location,
        path: result[1].Location,
      });
    });
  }

  private async sharpImage({ file, size: { width, height } }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      return (
        sharp(file.buffer)
          // todo: all configure params move to env variables
          .resize(width, height)
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
