// useful links about s3
// https://medium.com/@shamnad.p.s/how-to-create-an-s3-bucket-and-aws-access-key-id-and-secret-access-key-for-accessing-it-5653b6e54337
// https://medium.com/@shamnad.p.s/image-upload-to-aws-s3-using-nestjs-and-typescript-b32c079963e1

import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { UserService } from '../user/user.service';

@Module({
  controllers: [FilesController],
  providers: [FilesService, UserService],
  exports: [FilesService],
})
export class FilesModule {}
