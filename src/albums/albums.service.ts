import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Album } from '../models/album';
import { Image } from '../models/image';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
    @InjectModel('Image') private readonly imageModel: Model<Image>) {
  }

  async getAlbums(lang: langs = langs.eng): Promise<Album[]> {
    const albums = await this.albumModel.find().exec();

    return albums.map(album => ({
      id: album.id,
      title: lang === langs.rus ? album.title_rus : album.title_eng,
      cover: album.cover,
    }));
  }

  async getAlbum(id: string, lang: langs = langs.eng): Promise<Album> {
    const album = await this.findAlbum(id);
    const images = await this.findAlbumImages(id);

    return {
      id: album.id,
      title: lang === langs.rus ? album.title_rus : album.title_eng,
      cover: album.cover,
      images: images.map(image => ({
        id: image.id,
        title: lang === langs.rus ? image.title_rus : image.title_eng,
        path: image.path,
        previewPath: image.previewPath,
      })),
    };
  }

  // created separate function 'findAlbum' - return Monggose object Album
  // Mongoose object has methods like 'save', so we created this function for reuse
  private async findAlbum(id: string) {
    let album;

    try {
      album = await this.albumModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Couldn\'t find album');
    }

    if (!album) {
      throw new NotFoundException('Couldn\'t find album');
    }

    return album;
  }

  private async findAlbumImages(albumId: string) {
    let images;

    try {
      images = await this.imageModel.find({ albumId });
    } catch (error) {
      throw new NotFoundException('Couldn\'t find images');
    }

    if (!images) {
      throw new NotFoundException('Couldn\'t find images');
    }

    return images;
  }
}
