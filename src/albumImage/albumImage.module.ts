import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumImageService } from './albumImage.service';
import { AlbumImageSchema } from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AlbumImage', schema: AlbumImageSchema },
    ]),
  ],
  providers: [AlbumImageService],
  exports: [AlbumImageService]
})
export class AlbumImageModule {}
