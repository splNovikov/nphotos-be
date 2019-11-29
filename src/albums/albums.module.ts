import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { FilesService } from '../files/files.service';
import { ImagesService } from '../images/images.service';
import { AlbumSchema } from '../models/album';
import { ImageSchema } from '../models/image';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Image', schema: ImageSchema },
      { name: 'Album', schema: AlbumSchema },
    ]),
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, FilesService, ImagesService],
})
export class AlbumsModule {}
