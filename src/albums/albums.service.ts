// todo: remove:
import { google } from 'googleapis';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Album } from '../models/album';
// todo: remove:
import { albumsSpreadsheetId as spreadsheetId } from '../constants/sheets';
import { langs } from '../constants/langs.enum';
// todo: remove:
import { imagesPrefix, previewPrefix } from '../constants/googlePrefixes';

@Injectable()
export class AlbumsService {
  constructor(@InjectModel('Album') private readonly albumModel: Model<Album>) {
  }

  // todo: lang
  async getAlbums(lang: langs): Promise<Album[]> {
    const albums = await this.albumModel.find().exec();

    return albums.map(album => ({
      id: album.id,
      title: album.title,
      cover: album.cover,
      // todo: map images
      images: album.images,
    }));
  }

  // todo: lang
  async getAlbum(id: string, lang: langs): Promise<Album> {
    let album;

    try {
      album = await this.albumModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Couldn\'t find album');
    }

    if (!album) {
      throw new NotFoundException('Couldn\'t find album');
    }

    return {
      id: album.id,
      title: album.title,
      cover: album.cover,
      // todo: map images
      images: album.images,
    };
  }
}

// todo: remove:
// todo: why did I move it out from the class?
// async function getAlbums(lang = langs.eng): Promise<Album[]> {
  // const sheets = google.sheets({ version: 'v4' });
  // const request = {
  //   spreadsheetId,
  //   range: 'A2:C',
  // };
  // const res = await sheets.spreadsheets.values.get(request);

  // return res.data.values.map(([SheetNameEng, sheetNameRus, coverId]) => {
  //   const coverPath = getImagePath(coverId);
  //   const coverPreviewPath = getPreviewPath(coverPath);
  //
  //   return {
  //     // using SheetNameEng in id - to get correct sheet range for specific album (getAlbum)
  //     id: SheetNameEng,
  //     cover: coverPreviewPath,
  //     title: lang === langs.rus ? sheetNameRus : SheetNameEng,
  //   };
  // });
// }
//
// async function getAlbum(sheetName, lang = langs.eng): Promise<Album> {
//   const sheets = google.sheets({ version: 'v4' });
//   const request = { spreadsheetId, range: `${sheetName}!A2:C` };
//   const res = await sheets.spreadsheets.values.get(request);
//
//   return {
//     id: sheetName,
//     title: sheetName,
//     images: res.data.values.map(([titleRus, titleEng, imageId]) => {
//       const path = getImagePath(imageId);
//       const previewPath = getPreviewPath(path);
//
//       return {
//         title: lang === langs.rus ? titleRus : titleEng,
//         path,
//         previewPath,
//         id: imageId,
//       };
//     }),
//   };
// }

function getImagePath(id) {
  // backward compatibility - return path if it is a path in sheets
  if (id.startsWith('http')) {
    return id;
  }

  return `${imagesPrefix}/${id}`;
}

function getPreviewPath(path) {
  if (path.startsWith(imagesPrefix)) {
    return `${path}${previewPrefix}`;
  }

  // backward compatibility - return path if it is a path in sheets
  return path;
}
