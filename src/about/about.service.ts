import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

import { AuthenticationService } from '../authentication/authentication.service';
import { langs } from '../constants/langs.enum';
import { aboutSpreadsheetId as spreadsheetId } from '../constants/sheets';

@Injectable()
export class AboutService {
  constructor(private authenticationService: AuthenticationService) {}

  async getAbout(lang: langs): Promise<string[]> {
    const oAuth2Client = this.authenticationService.getOAuth2Client();

    return await getAbout(oAuth2Client, lang);
  }
}

async function getAbout(auth, lang = langs.eng): Promise<string[]> {
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId,
    range: 'A2:B',
  };
  const res = await sheets.spreadsheets.values.get(request);

  return res.data.values.map(([aboutEng, aboutRus]) => lang === langs.rus ? aboutRus : aboutEng);
}
