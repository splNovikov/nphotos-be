import { Module } from '@nestjs/common';
import { PriceListController } from './priceList.controller';
import { PriceListService } from './priceList.service';

@Module({
  imports: [],
  controllers: [PriceListController],
  providers: [PriceListService],
})
export class PriceListModule {}
