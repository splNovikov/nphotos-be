import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumsModule } from '../albums/albums.module';
import { AlbumCategoryModule } from '../albumCategory/albumCategory.module';
import { FilesModule } from '../files/files.module';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CategorySchema } from '../models';

@Module({
  imports: [
    forwardRef(() => AlbumsModule),
    FilesModule,
    AlbumCategoryModule,
    MongooseModule.forFeature([{ name: 'Category', schema: CategorySchema }]),
  ],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
