import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImagesService } from '../images/images.service';
import { FilesService } from '../files/files.service';
import { Album, AlbumDTO, Image } from '../models';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
    private readonly filesService: FilesService,
    private readonly imagesService: ImagesService,
  ) {}

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

  // todo: also should be able to remove images
  public async updateAlbum(
    @Query() query,
    @Req() req,
    @Res() res,
  ): Promise<AlbumDTO> {
    let files;

    try {
      files = await this.filesService.imagesUpload(req, res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const { id: albumId, lang } = query;
    // todo: lang should not be undefined - test it

    // 1. todo: add images to mongo
    // 2. todo: add images to album
    const newImages = files.map(f => ({
      // todo: should be resized image
      path: f.location,
      // todo: should be preview
      previewPath: f.location,
      albumId,
      title_eng: 'test image title',
      title_rus: 'тестовое название изображения',
    }));

    await this.imagesService.addImages(newImages);

    // todo: fix it, and figure out - why do we need return status with json?
    return res.status(201).json({
      id: albumId,
      title: 'testTitle',
      cover: 'testCover',
    } as AlbumDTO);
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
