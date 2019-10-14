import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Price, PriceDTO } from '../models/price';
import { langs } from '../constants/langs.enum';

@Injectable()
export class PriceListService {
  constructor(@InjectModel('Price') private readonly priceModel: Model<Price>) {}

  async getPriceList(lang: langs = langs.eng): Promise<PriceDTO[]> {
    const price = await this.priceModel.find().exec();

    return price
      .sort((a, b) => (a.order > b.order) ? 1 : ((b.order > a.order) ? -1 : 0))
      .map(p => new PriceDTO(
        p.id,
        lang === langs.rus ? p.price_rus : p.price_eng,
      ));
  }
}
