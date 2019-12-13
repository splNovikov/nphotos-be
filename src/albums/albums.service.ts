import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImagesService } from '../images/images.service';
import { Album, AlbumDTO, AlbumCategory } from '../models';
import { langs } from '../constants/langs.enum';
import { simultaneousPromises } from '../utils/multiPromises';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
    @InjectModel('AlbumCategory')
    private readonly albumCategoryModel: Model<AlbumCategory>,
    private readonly imagesService: ImagesService,
  ) {}

  public async getAlbumsDTO(lang): Promise<AlbumDTO[]> {
    const albums = await this._getAlbums();

    return albums.map(album => ({
      id: album.id,
      title: lang === langs.rus ? album.title_rus : album.title_eng,
      cover: album.cover,
    }));
  }

  public async getFullAlbumDTOById(albumId: string, lang): Promise<AlbumDTO> {
    const [album, images] = await simultaneousPromises(
      [
        () => this.getAlbumDTOById(albumId, lang),
        () => this.imagesService.getImagesDTO(albumId, lang),
      ],
      2,
    );

    return { ...album, images };
  }

  public async getAlbumsDTOByCategoryId(
    categoryId: string,
    lang,
  ): Promise<AlbumDTO[]> {
    const albumsIds = await this._getCategoryAlbumsIds(categoryId);

    return await simultaneousPromises(
      albumsIds.map(albumId => () => this.getAlbumDTOById(albumId, lang)),
    );
  }

  // todo: also should be able to remove and rename images
  public async updateAlbum(query, req, res): Promise<AlbumDTO> {
    const { id: albumId, lang } = query;
    // todo: lang should not be undefined - test it
    // const album = await this._getAlbumById(albumId);

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

  private async getAlbumDTOById(albumId: string, lang): Promise<AlbumDTO> {
    const album: Album = await this._getAlbumById(albumId);

    return {
      id: album.id,
      title: lang === langs.rus ? album.title_rus : album.title_eng,
      cover: album.cover,
    };
  }

  private async _getAlbums(): Promise<Album[]> {
    let albums: Album[];

    try {
      albums = await this.albumModel.find().exec();
    } catch (error) {
      throw new NotFoundException(`Couldn't find albums`);
    }

    if (!albums) {
      throw new NotFoundException(`Couldn't find albums`);
    }

    return albums;
  }

  // created separate function 'findAlbum' - return Mongoose object Album
  // Mongoose object have methods like 'save', so we created this function for reuse
  private async _getAlbumById(id: string): Promise<Album> {
    let album: Album;

    try {
      album = await this.albumModel.findById(id);
    } catch (error) {
      throw new NotFoundException(`Couldn't find album: ${error.message}`);
    }

    if (!album) {
      throw new NotFoundException(`Couldn't find album`);
    }

    return album;
  }

  private async _getCategoryAlbumsIds(categoryId: string): Promise<string[]> {
    let categoryAlbums: AlbumCategory[];

    try {
      categoryAlbums = await this.albumCategoryModel.find({ categoryId });
    } catch (error) {
      throw new NotFoundException(`Couldn't find category albums`);
    }

    if (!categoryAlbums) {
      throw new NotFoundException(`Couldn't find category albums`);
    }

    return categoryAlbums.map(
      (albumCategory: AlbumCategory) => albumCategory.albumId,
    );
  }
}
