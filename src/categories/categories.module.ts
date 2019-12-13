import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AlbumsService } from '../albums/albums.service';
import { ImagesService } from '../images/images.service';
import {
  AlbumSchema,
  AlbumCategorySchema,
  CategorySchema,
  ImageSchema,
} from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'AlbumCategory', schema: AlbumCategorySchema },
      { name: 'Image', schema: ImageSchema },
      { name: 'Album', schema: AlbumSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, AlbumsService, ImagesService],
})
export class CategoriesModule {}
