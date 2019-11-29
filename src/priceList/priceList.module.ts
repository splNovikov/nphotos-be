import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PriceListController } from './priceList.controller';
import { PriceListService } from './priceList.service';
import { PriceSchema } from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Price', schema: PriceSchema }]),
  ],
  controllers: [PriceListController],
  providers: [PriceListService],
})
export class PriceListModule {}
