import { Req, Res, Injectable } from '@nestjs/common';
import * as multer from 'multer';
import * as AWS from 'aws-sdk';
import * as multerS3 from 'multer-s3';

const { AWS_S3_BUCKET_NAME, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;
const s3 = new AWS.S3();
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
const maxUploadFiles = 20;

@Injectable()
export class FilesService {

  async imagesUpload(@Req() req, @Res() res) {
    // todo: prevent other files upload except jpg files
    try {
      this.upload(req, res, error => {
        return error
          ? res.status(error.statusCode).json(`${error.statusCode} Failed to upload image file: ${error}`)
          : res.status(201).json(req.files);
      });
    } catch (error) {
      return res.status(error.statusCode).json(`${error.statusCode} Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: (request, file, cb) =>
        cb(null, `${Date.now().toString()}-${file.originalname}`),
    }),
  }).array('upload', maxUploadFiles);
}
