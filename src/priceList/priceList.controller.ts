import { Controller, Get, Query } from '@nestjs/common';
import { PriceListService } from './priceList.service';

import { PriceDTO } from '../models';
import { langs } from '../constants/langs.enum';

@Controller('priceList')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Get()
  getPriceList(@Query('lang') lang: langs = langs.eng): Promise<PriceDTO[]> {
    return this.priceListService.getPriceListDTO(lang);
  }
}
