import {
  Injectable,
  BadRequestException,
  UploadedFiles,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { extname } from 'path';
import * as sharp from 'sharp';
import { ManagedUpload } from 'aws-sdk/lib/s3/managed_upload';
import * as S3 from 'aws-sdk/clients/s3';

import { s3, s3DeleteParams, s3Params } from './s3.config';
import { simultaneousPromises } from '../utils/multiPromises';
import { Image } from '../models';

const {
  AWS_UPLOAD_LIMIT,
  IMAGE_MIME_TYPES,
  IMAGE_PREVIEW_WIDTH,
  IMAGE_PREVIEW_HEIGHT,
  IMAGE_PREVIEW_PREFIX,
  IMAGE_UPLOAD_QUALITY,
  COVER_PREFIX,
} = process.env;
const imagesUploadLimit = +AWS_UPLOAD_LIMIT;
const imagesMimeRegex = new RegExp(IMAGE_MIME_TYPES);
const imagePreviewSize = {
  width: +IMAGE_PREVIEW_WIDTH,
  height: +IMAGE_PREVIEW_HEIGHT,
};
const imageUploadQuality = +IMAGE_UPLOAD_QUALITY;

// todo [after release]: show "upload progress bar"
@Injectable()
export class FilesService {
  public async imagesUpload(
    @UploadedFiles() files,
  ): Promise<{ previewPath; path; awsKey; previewAwsKey }[]> {
    if (!files || !files.length) {
      throw new BadRequestException(
        'Your request is missing details. No files to upload',
      );
    }

    return simultaneousPromises(
      files.map(f => () => this.processImage(f)),
      imagesUploadLimit,
    );
  }

  public async coverUpload(@UploadedFile() file): Promise<{ path; awsKey }> {
    if (!file) {
      throw new BadRequestException(
        'Your request is missing details. No files to upload',
      );
    }

    return this.processCover(file);
  }

  public async deleteImage(image: Image): Promise<void> {
    if (!image) {
      throw new BadRequestException('Your request is missing details.');
    }

    return this.processDeleteImage(image);
  }

  private async processDeleteImage(image: Image): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        await Promise.all([
          this.s3Delete(image.awsKey),
          this.s3Delete(image.previewAwsKey),
        ]);
      } catch (e) {
        Logger.error(e);
        return reject(new BadRequestException(e.message));
      }

      return resolve();
    });
  }

  private async processImage(
    @UploadedFile() file,
  ): Promise<{ previewPath; path; awsKey; previewAwsKey }> {
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
      const [previewImage, decreasedImage] = await Promise.all([
        // preview:
        this.sharpImage({ file, size: imagePreviewSize }),
        // big:
        this.decreaseQualityImage({ file, quality: imageUploadQuality || 100 }),
      ]);

      // 3. Upload to s3:
      let result: ManagedUpload.SendData[];

      try {
        result = await Promise.all([
          this.s3Upload(
            { ...file, buffer: previewImage },
            IMAGE_PREVIEW_PREFIX,
          ),
          this.s3Upload({ ...file, buffer: decreasedImage }),
        ]);
      } catch (e) {
        Logger.error(e);
        return reject(new BadRequestException(e.message));
      }

      return resolve({
        previewPath: result[0].Location,
        previewAwsKey: result[0].Key,
        path: result[1].Location,
        awsKey: result[1].Key,
      });
    });
  }

  private async processCover(@UploadedFile() file): Promise<{ path; awsKey }> {
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
      const previewImage = await this.sharpImage({
        file,
        size: imagePreviewSize,
      });

      // 3. Upload to s3:
      let result: ManagedUpload.SendData;

      try {
        result = await this.s3Upload(
          { ...file, buffer: previewImage },
          COVER_PREFIX,
        );
      } catch (e) {
        Logger.error(e);
        return reject(new BadRequestException(e.message));
      }

      return resolve({
        path: result.Location,
        awsKey: result.Key,
      });
    });
  }

  private async sharpImage({ file, size: { width, height } }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      return sharp(file.buffer)
        .resize(width, height)
        .toBuffer()
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          Logger.error(err);
          reject(err);
        });
    });
  }

  private async decreaseQualityImage({ file, quality }): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      return sharp(file.buffer)
        .jpeg({
          quality,
          // 4:4:4' to prevent chroma subsampling when quality <= 90
          chromaSubsampling: '4:4:4',
        })
        .toBuffer()
        .then(data => {
          resolve(data);
        })
        .catch(err => {
          Logger.error(err);
          reject(err);
        });
    });
  }

  private async s3Upload(
    @UploadedFile() file,
    prefix?: string,
  ): Promise<ManagedUpload.SendData> {
    return new Promise((resolve, reject) => {
      return s3.upload(
        s3Params({
          key: `${prefix ? prefix + '-' : ''}${Date.now().toString()}-${
            file.originalname
          }`,
          file,
        }),
        (error, data) => (error ? reject(error) : resolve(data)),
      );
    });
  }

  private async s3Delete(key: string): Promise<S3.DeleteObjectOutput> {
    return new Promise((resolve, reject) => {
      return s3.deleteObject(s3DeleteParams(key), (error, data) =>
        error ? reject(error) : resolve(data),
      );
    });
  }
}
