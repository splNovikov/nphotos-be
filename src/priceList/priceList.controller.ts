import { Controller, Get, Query } from '@nestjs/common';
import { PriceListService } from './priceList.service';

import { PriceDTO } from '../models';

@Controller('priceList')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Get()
  getPriceList(@Query('lang') lang): Promise<PriceDTO[]> {
    return this.priceListService.getPriceList(lang);
  }
}
