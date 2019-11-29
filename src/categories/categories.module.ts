import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AlbumsService } from '../albums/albums.service';
import { FilesService } from '../files/files.service';
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
      // why do we need inject it again? why Module doesn't help?
      { name: 'Image', schema: ImageSchema },
      { name: 'Album', schema: AlbumSchema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService, AlbumsService, FilesService, ImagesService],
})
export class CategoriesModule {}
