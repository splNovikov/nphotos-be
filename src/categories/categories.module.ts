import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { AlbumsService } from '../albums/albums.service';
import { CategorySchema } from '../models/category';
import { AlbumCategorySchema } from '../models/albumCategory';
import { ImageSchema } from '../models/image';
import { AlbumSchema } from '../models/album';

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
  providers: [CategoriesService, AlbumsService],
})
export class CategoriesModule {}
