import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumCategoryService } from './albumCategory.service';
import { AlbumCategorySchema } from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AlbumCategory', schema: AlbumCategorySchema },
    ]),
  ],
  providers: [AlbumCategoryService],
  exports: [AlbumCategoryService],
})
export class AlbumCategoryModule {}
