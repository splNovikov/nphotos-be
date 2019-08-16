import { Module } from '@nestjs/common';
import { PriceListController } from './priceList.controller';
import { PriceListService } from './priceList.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Module({
  imports: [],
  controllers: [PriceListController],
  providers: [AuthenticationService, PriceListService],
})
export class PriceListModule {}
