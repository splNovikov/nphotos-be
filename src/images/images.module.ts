import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumImageModule } from '../albumImage/albumImage.module';
import { ImagesService } from './images.service';
import { FilesService } from '../files/files.service';
import { ImagesController } from './images.controller';
import { ImageSchema } from '../models';

@Module({
  imports: [
    AlbumImageModule,
    MongooseModule.forFeature([
      { name: 'Image', schema: ImageSchema }
    ]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, FilesService],
  exports: [ImagesService, FilesService]
})
export class ImagesModule {}
