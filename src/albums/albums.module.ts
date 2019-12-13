import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { ImagesService } from '../images/images.service';
import {
  AlbumSchema,
  ImageSchema,
  AlbumCategorySchema,
  AlbumImageSchema,
} from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Image', schema: ImageSchema },
      { name: 'Album', schema: AlbumSchema },
      { name: 'AlbumCategory', schema: AlbumCategorySchema },
      { name: 'AlbumImage', schema: AlbumImageSchema },
    ]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, ImagesService],
})
export class AlbumsModule {}
