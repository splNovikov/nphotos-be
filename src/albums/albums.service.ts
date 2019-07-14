import { google } from 'googleapis';
import { Injectable } from '@nestjs/common';
import { Album } from '../models/album';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class AlbumsService {
  constructor(private authenticationService: AuthenticationService) {}

  async getAlbum(id: string): Promise<Album> {
    const oAuth2Client = this.authenticationService.getOAuth2Client();

    return await getAlbum(oAuth2Client, id);
  }
}

async function getAlbum(auth, spreadsheetId): Promise<Album> {
  const sheets = google.sheets({ version: 'v4', auth });
  const request = { spreadsheetId, range: 'A2:B' };
  const res = await sheets.spreadsheets.values.get(request);

  return {
    id: spreadsheetId,
    title: getTitle(res.data.range),
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

function getTitle(range) {
  return range.substring(0, range.indexOf('!'));
}
