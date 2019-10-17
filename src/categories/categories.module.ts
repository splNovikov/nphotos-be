import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchema } from '../models/category';
import { AlbumCategorySchema } from '../models/albumCategory';

@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: 'Category', schema: CategorySchema },
      { name: 'AlbumCategory', schema: AlbumCategorySchema },
    ])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
