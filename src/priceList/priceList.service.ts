import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Price } from '../models/price';
import { langs } from '../constants/langs.enum';
import { priceListSpreadsheetId as spreadsheetId } from '../constants/sheets';

@Injectable()
export class PriceListService {
  // todo: empty controller
  constructor() {}

  async getPriceList(lang: langs): Promise<Price[]> {
    return await getPriceList(lang);
  }
}

async function getPriceList(lang = langs.eng): Promise<Price[]> {
  const sheets = google.sheets({ version: 'v4' });
  const request = {
    spreadsheetId,
    range: 'A2:B',
  };
  const res = await sheets.spreadsheets.values.get(request);

  return res.data.values.map(([priceEng, priceRus], index) => ({
    index,
    price: lang === langs.rus ? priceRus : priceEng,
  }));
}
