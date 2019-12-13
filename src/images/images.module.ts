import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImagesService } from './images.service';
import { FilesService } from '../files/files.service';
import { ImagesController } from './images.controller';
import { AlbumImageSchema, ImageSchema } from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Image', schema: ImageSchema },
      { name: 'AlbumImage', schema: AlbumImageSchema },
    ]),
  ],
  controllers: [ImagesController],
  providers: [ImagesService, FilesService],
})
export class ImagesModule {}
