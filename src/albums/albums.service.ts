import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Album, AlbumDTO } from '../models/album';
import { Image, ImageDTO } from '../models/image';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}

  // todo: return everywhere res.status(201)
  async getAlbums(lang: langs = langs.eng): Promise<AlbumDTO[]> {
    const albums = await this.albumModel.find().exec();

    return albums.map(
      album =>
        new AlbumDTO(
          album.id,
          lang === langs.rus ? album.title_rus : album.title_eng,
          album.cover,
        ),
    );
  }

  async getAlbum(albumId: string, lang: langs = langs.eng): Promise<AlbumDTO> {
    const album: Album = await this.findAlbum(albumId);
    const images: Image[] = await this.findAlbumImages(albumId);

    return new AlbumDTO(
      album.id,
      lang === langs.rus ? album.title_rus : album.title_eng,
      album.cover,
      images.map(
        image =>
          new ImageDTO(
            image.id,
            lang === langs.rus ? image.title_rus : image.title_eng,
            image.path,
            image.previewPath,
          ),
      ),
    );
  }

  // get album without optional properties, like "images"
  async getSimpleAlbum(
    albumId: string,
    lang: langs = langs.eng,
  ): Promise<AlbumDTO> {
    const album: Album = await this.findAlbum(albumId);

    return new AlbumDTO(
      album.id,
      lang === langs.rus ? album.title_rus : album.title_eng,
      album.cover,
    );
  }

  // created separate function 'findAlbum' - return Monggose object Album
  // Mongoose object has methods like 'save', so we created this function for reuse
  private async findAlbum(id: string): Promise<Album> {
    let album: Album;

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

  private async findAlbumImages(albumId: string): Promise<Image[]> {
    let images: Image[];

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
