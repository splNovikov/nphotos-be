import * as AWS from 'aws-sdk';
import { PutObjectRequest } from 'aws-sdk/clients/s3';

const {
  AWS_S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;
AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});
const s3 = new AWS.S3();

function s3Params({ key, file }: { key: string; file: any }): PutObjectRequest {
  return {
    Bucket: AWS_S3_BUCKET_NAME,
    ACL: 'public-read',
    Key: key,
    Body: file.buffer,
  };
}

export { s3, s3Params };
