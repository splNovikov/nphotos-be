import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { Album } from '../models/album';
import { AuthenticationService } from '../authentication/authentication.service';
import { spreadsheetId } from '../constants/sheets';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AlbumsService {
  constructor(private authenticationService: AuthenticationService) {}

  async getAlbums(lang: langs): Promise<Album[]> {
    const oAuth2Client = this.authenticationService.getOAuth2Client();

    return await getAlbums(oAuth2Client, lang);
  }

  async getAlbum(id: string, lang: langs): Promise<Album> {
    const oAuth2Client = this.authenticationService.getOAuth2Client();

    return await getAlbum(oAuth2Client, id, lang);
  }
}

async function getAlbums(auth, lang = langs.eng): Promise<Album[]> {
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId,
    range: 'A2:B',
  };
  const res = await sheets.spreadsheets.values.get(request);

  return res.data.values.map(([SheetNameEng, sheetNameRus]) => ({
    id: SheetNameEng,
    title: lang === langs.rus ? sheetNameRus : SheetNameEng,
  }));
}

async function getAlbum(auth, sheetName, lang = langs.eng): Promise<Album> {
  const sheets = google.sheets({ version: 'v4', auth });
  const request = { spreadsheetId, range: `${sheetName}!A2:C` };
  const res = await sheets.spreadsheets.values.get(request);

  return {
    id: sheetName,
    title: sheetName,
    images: res.data.values.map(([titleRus, titleEng, path]) => ({
      title: lang === langs.rus ? titleRus : titleEng,
      path,
      id: generateId(path),
    })),
  };
}

function generateId(vkImageSrc) {
  return vkImageSrc.substring(
    vkImageSrc.lastIndexOf('/') + 1,
    vkImageSrc.length - 4,
  );
}
