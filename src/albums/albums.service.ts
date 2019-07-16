import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { Album } from '../models/album';
import { AuthenticationService } from '../authentication/authentication.service';
import { spreadsheetId } from '../constants/sheets';

@Injectable()
export class AlbumsService {
  constructor(private authenticationService: AuthenticationService) {}

  async getAlbums(): Promise<Album[]> {
    const oAuth2Client = this.authenticationService.getOAuth2Client();

    return await getAlbums(oAuth2Client);
  }

  async getAlbum(id: string): Promise<Album> {
    const oAuth2Client = this.authenticationService.getOAuth2Client();

    return await getAlbum(oAuth2Client, id);
  }
}

async function getAlbums(auth): Promise<Album[]> {
  const sheets = google.sheets({ version: 'v4', auth });
  const request = {
    spreadsheetId,
    range: 'A2:A',
  };
  const res = await sheets.spreadsheets.values.get(request);

  return res.data.values.map(([sheetName]) => ({
    id: sheetName,
    title: sheetName,
  }));
}

async function getAlbum(auth, sheetName): Promise<Album> {
  const sheets = google.sheets({ version: 'v4', auth });
  const request = { spreadsheetId, range: `${sheetName}!A2:B` };
  const res = await sheets.spreadsheets.values.get(request);

  return {
    id: sheetName,
    title: sheetName,
    images: res.data.values.map(([title, path]) => ({
      title,
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
