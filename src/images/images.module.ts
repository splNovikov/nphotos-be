import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImagesService } from './images.service';
import { ImageSchema } from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
  ],
  providers: [ImagesService],
})
export class ImagesModule {}
