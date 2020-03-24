import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumImageModule } from '../albumImage/albumImage.module';
import { FilesModule } from '../files/files.module';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { ImageSchema } from '../models';

@Module({
  imports: [
    FilesModule,
    AlbumImageModule,
    MongooseModule.forFeature([
      { name: 'Image', schema: ImageSchema }
    ]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService]
})
export class ImagesModule {}
