import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AlbumsService } from '../albums/albums.service';
import { ImagesService } from '../images/images.service';
import { FilesService } from '../files/files.service';
import {
  AlbumSchema,
  AlbumCategorySchema,
  CategorySchema,
  ImageSchema,
  AlbumImageSchema,
} from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'AlbumCategory', schema: AlbumCategorySchema },
      { name: 'Image', schema: ImageSchema },
      { name: 'Album', schema: AlbumSchema },
      { name: 'AlbumImage', schema: AlbumImageSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, AlbumsService, ImagesService, FilesService],
})
export class CategoriesModule {}
