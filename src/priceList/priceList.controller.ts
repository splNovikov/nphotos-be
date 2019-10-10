import { Controller, Get, Query } from '@nestjs/common';
import { PriceListService } from './priceList.service';

import { Price } from '../models/price';

@Controller('priceList')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Get()
  getPriceList(@Query() query): Promise<Price[]> {
    return this.priceListService.getPriceList(query.lang);
  }
}