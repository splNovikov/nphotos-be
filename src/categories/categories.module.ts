import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImagesModule } from '../images/images.module';
import { AlbumsModule } from '../albums/albums.module';
import { AlbumCategoryModule } from '../albumCategory/albumCategory.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchema } from '../models';

@Module({
  imports: [
    AlbumsModule,
    ImagesModule,
    AlbumCategoryModule,
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
