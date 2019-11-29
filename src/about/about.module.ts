import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AboutSchema } from '../models';

@Module({
  imports: [MongooseModule.forFeature(
    [
      { name: 'About', schema: AboutSchema },
    ])],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
