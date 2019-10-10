import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

import { Contact } from '../models/contact';
import { langs } from '../constants/langs.enum';
import { contactsSpreadsheetId as spreadsheetId } from '../constants/sheets';

@Injectable()
export class ContactsService {
  // todo: empty controller
  constructor() {
  }

  async getContacts(lang: langs): Promise<Contact[]> {
    return await getContacts(lang);
  }
}

async function getContacts(lang = langs.eng): Promise<Contact[]> {
  const sheets = google.sheets({ version: 'v4' });
  const request = {
    spreadsheetId,
    range: 'A2:I',
  };
  const res = await sheets.spreadsheets.values.get(request);

  return res.data.values.map(([nameEng,
                                nameRus,
                                avatar,
                                vkLink,
                                instagramLink,
                                facebookLink,
                                phone,
                                shortDescriptionEng,
                                shortDescriptionRus],
                              index) => ({
    id: `${index}`,
    avatar,
    name: lang === langs.rus ? nameRus : nameEng,
    vkLink,
    instagramLink,
    facebookLink,
    phone,
    shortDescription: lang === langs.rus ? shortDescriptionRus : shortDescriptionEng,
  }));
}
