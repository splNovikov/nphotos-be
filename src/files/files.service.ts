import { Req, Res, Injectable, Query } from '@nestjs/common';
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

  // todo: do we need everywhere @Query, and etc
  // todo: add await as everywhere
  async imagesUpload(@Query() query, @Req() req, @Res() res) {
    // todo: prevent other files upload except jpg files
    try {
      this.upload(req, res, error => {
        if (error) {
          // todo: is it a good error handling?
          return res.status(error.statusCode).json(`${error.statusCode} Failed to upload image file: ${error}`);
        }

        // 1. todo: add images to mongo
        // 2. todo: add images to album
        // todo: Image is an interface, we can not use "new"
        // const images = req.files.map(file => new Image())
        // todo: call method from album controller
        // this.addImages(query.albumId, images);

        return res.status(201).json(req.files);
      });
    } catch (error) {
      return res.status(error.statusCode).json(`${error.statusCode} Failed to upload image file: ${error}`);
    }
  }

  // addImages = (albumId, images) => {
  //   // todo: if no albumId - throw exception
  // }

  upload = multer({
    storage: multerS3({
      s3,
      bucket: AWS_S3_BUCKET_NAME,
      acl: 'public-read',
      key: (request, file, cb) =>
        cb(null, `${Date.now().toString()}-${file.originalname}`),
    }),
  }).array('image', maxUploadFiles);
}
