// import { config as AWSConfig } from 'aws-sdk';
// import * as S3 from 'aws-sdk/clients/s3';

const {
  AWS_S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;
// AWSConfig.update({
//   accessKeyId: AWS_ACCESS_KEY_ID,
//   secretAccessKey: AWS_SECRET_ACCESS_KEY,
// });
// const s3 = new S3();
const s3 = {
  upload: (a,b) => {}
};

function s3Params({ key, file }: { key: string; file: any }) {
  return {
    Bucket: AWS_S3_BUCKET_NAME,
    ACL: 'public-read',
    Key: key,
    Body: file.buffer,
  };
}

export { s3, s3Params };
