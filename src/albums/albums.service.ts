import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImagesService } from '../images/images.service';
import { Album, AlbumDTO, Image } from '../models';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
    private readonly imagesService: ImagesService,
  ) {}

  // todo: add DTO everywhere where we return DTOs
  public async getAlbums(lang: langs = langs.eng): Promise<AlbumDTO[]> {
    const albums = await this._getAlbums();

    return albums.map(album => ({
      id: album.id,
      title: lang === langs.rus ? album.title_rus : album.title_eng,
      cover: album.cover,
    }));
  }

  public async getAlbum(
    albumId: string,
    lang: langs = langs.eng,
  ): Promise<AlbumDTO> {
    const album: Album = await this._getAlbum(albumId);
    const images: Image[] = await this.imagesService.getImages(albumId);

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

  // to increase performance - get album without optional properties, like "images"
  public async getSimpleAlbum(
    albumId: string,
    lang: langs = langs.eng,
  ): Promise<AlbumDTO> {
    const album: Album = await this._getAlbum(albumId);

    return {
      id: album.id,
      title: lang === langs.rus ? album.title_rus : album.title_eng,
      cover: album.cover,
    };
  }

  // todo: also should be able to remove and rename images
  public async updateAlbum(query, req, res): Promise<AlbumDTO> {
    const { id: albumId, lang } = query;
    // todo: lang should not be undefined - test it
    // const album = await this._getAlbum(albumId);

    // add images to Mongo:
    // insertedImages = await this.imagesService.addImages(uploadedImages, albumId);
    // }

    // todo: fix it, and figure out - why do we need return status with json?
    return res.status(201).json({
      id: albumId,
      // title: album.title_eng,
      // cover: album.cover,
      // todo: previous images + new images
      // images: insertedImages,
    });
  }

  private async _getAlbums(): Promise<Album[]> {
    let albums: Album[];

    try {
      albums = await this.albumModel.find().exec();
    } catch (error) {
      throw new NotFoundException('Couldn\'t find albums');
    }

    if (!albums) {
      throw new NotFoundException('Couldn\'t find albums');
    }

    return albums;
  }

  // created separate function 'findAlbum' - return Mongoose object Album
  // Mongoose object have methods like 'save', so we created this function for reuse
  private async _getAlbum(id: string): Promise<Album> {
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
}
