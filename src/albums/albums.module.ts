import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { ImagesService } from '../images/images.service';
import { AlbumSchema, ImageSchema, AlbumCategorySchema } from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Image', schema: ImageSchema },
      { name: 'Album', schema: AlbumSchema },
      { name: 'AlbumCategory', schema: AlbumCategorySchema },
    ]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, ImagesService],
})
export class AlbumsModule {}
