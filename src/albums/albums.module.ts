import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImagesModule } from '../images/images.module';
import { AlbumCategoryModule } from '../albumCategory/albumCategory.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { AlbumSchema, CategorySchema } from '../models';
import { CategoriesService } from '../categories/categories.service';

@Module({
  imports: [
    ImagesModule,
    AlbumCategoryModule,
    MongooseModule.forFeature([
      { name: 'Category', schema: CategorySchema },
      { name: 'Album', schema: AlbumSchema },
    ]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, CategoriesService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
