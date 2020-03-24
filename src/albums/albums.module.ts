import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImagesModule } from '../images/images.module';
import { AlbumCategoryModule } from '../albumCategory/albumCategory.module';
import { CategoriesModule } from '../categories/categories.module';
import { FilesModule } from '../files/files.module';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { AlbumSchema } from '../models';

@Module({
  imports: [
    forwardRef(() => CategoriesModule),
    FilesModule,
    ImagesModule,
    AlbumCategoryModule,
    MongooseModule.forFeature([{ name: 'Album', schema: AlbumSchema }]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService],
  exports: [AlbumsService],
})
export class AlbumsModule {}
