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

@Injectable()
export class FilesService {

  async imagesUpload(@Req() req, @Res() res) {
    // todo: prevent other files upload except jpg files
    try {
      this.upload(req, res, error => {
        if (error) {
          // todo: why 404
          return res.status(404).json(`Failed to upload image file: ${error}`);
        }
        return res.status(201).json(req.files);
      });
    } catch (error) {
      // todo: why 500
      return res.status(500).json(`Failed to upload image file: ${error}`);
    }
  }

  upload = multer({
    storage: multerS3({
      s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: (request, file, cb) => {
        cb(null, `${Date.now().toString()}-${file.originalname}`);
      },
    }),
  }).array('upload', 20);
}
