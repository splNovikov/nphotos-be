import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Price, PriceDTO } from '../models';
import { langs } from '../constants/langs.enum';

@Injectable()
export class PriceListService {
  constructor(
    @InjectModel('Price') private readonly priceModel: Model<Price>,
  ) {}

  public async getPriceListDTO(lang): Promise<PriceDTO[]> {
    const price = await this._getPriceList();

    return price
      .sort((a, b) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0))
      .map(
        p =>
          ({
            index: p.id,
            price: lang === langs.rus ? p.price_rus : p.price_eng,
          } as PriceDTO),
      );
  }

  private async _getPriceList(): Promise<Price[]> {
    let price: Price[];

    try {
      price = await this.priceModel.find().exec();
    } catch (error) {
      throw new NotFoundException(`Couldn't find price`);
    }

    if (!price) {
      throw new NotFoundException(`Couldn't find price`);
    }

    return price;
  }
}
