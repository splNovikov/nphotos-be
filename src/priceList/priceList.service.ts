import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { Price } from '../models/price';
import { AuthenticationService } from '../authentication/authentication.service';
import { langs } from '../constants/langs.enum';
import { priceListSpreadsheetId as spreadsheetId } from '../constants/sheets';

@Injectable()
export class PriceListService {
  constructor(private authenticationService: AuthenticationService) {}

  async getPriceList(lang: langs): Promise<Price[]> {
    const oAuth2Client = this.authenticationService.getOAuth2Client();

    return await getPriceList(oAuth2Client, lang);
  }
}

async function getPriceList(auth, lang = langs.eng): Promise<Price[]> {
  const sheets = google.sheets({ version: 'v4', auth });
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
