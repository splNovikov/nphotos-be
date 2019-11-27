import { Req, Res, Injectable, BadRequestException } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';
import { StreamFiles } from 'aws-sdk/clients/iot';

const {
  AWS_S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
const maxUploadFiles = 20;

@Injectable()
export class FilesService {
  // todo: prevent other files upload except jpg files
  imagesUpload(@Req() req, @Res() res): Promise<StreamFiles> {
    try {
      return new Promise((resolve, reject) => {
        this.s3ImagesUpload(req, res, error => {
          if (error) {
            reject(error);
          }

          resolve(req.files);
        });
      });
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  s3ImagesUpload = multer({
    storage: multerS3({
      s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: (request, file, cb) =>
        cb(null, `${Date.now().toString()}-${file.originalname}`),
    }),
  }).array('image', maxUploadFiles);
}
