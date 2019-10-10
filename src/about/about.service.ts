import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { About } from '../models/about';
import { langs } from '../constants/langs.enum';
import { aboutSpreadsheetId as spreadsheetId } from '../constants/sheets';

@Injectable()
export class AboutService {
  // todo: empty controller
  constructor() {}

  async getAbout(lang: langs): Promise<About[]> {

    return await getAbout(lang);
  }
}

async function getAbout(lang = langs.eng): Promise<About[]> {
  const sheets = google.sheets({ version: 'v4' });
  const request = {
    spreadsheetId,
    range: 'A2:B',
  };
  const res = await sheets.spreadsheets.values.get(request);

  return res.data.values.map(([aboutEng, aboutRus], index) => ({
    index,
    row: lang === langs.rus ? aboutRus : aboutEng,
  }));
}
