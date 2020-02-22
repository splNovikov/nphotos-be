import {
  BadRequestException,
  Body,
  HttpStatus,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImagesService } from '../images/images.service';
import {
  Album,
  AlbumDTO,
  AlbumCategory,
  CreateAlbumDTO,
  Image,
} from '../models';
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
      title: lang === langs.rus ? album.titleRus : album.titleEng,
      cover: album.cover,
    }));
  }

  public async getFullAlbumDTOById(albumId: string, lang): Promise<AlbumDTO> {
    const [album, images] = await Promise.all([
      this.getAlbumDTOById(albumId, lang),
      this.imagesService.getImagesDTOByAlbumId(albumId, lang),
    ]);

    return { ...album, images };
  }

  public async getAlbumsDTOByCategoryId(
    categoryId: string,
    lang,
  ): Promise<AlbumDTO[]> {
    const albumsIds = await this._getCategoryAlbumsIds(categoryId);

    return await simultaneousPromises(
      albumsIds.map(albumId => () => this.getAlbumDTOById(albumId, lang)),
      5,
    );
  }

  // 1. Create album in Mongo
  // 2. Assign album to Category in mongo
  public async createAlbum(
    @Body() albumJSON: string,
    cover: Image,
    @Res() res,
  ): Promise<Album> {
    const album: CreateAlbumDTO = JSON.parse(albumJSON);
    const createdDate = Date();

    // 1. Create Album
    const newAlbum = await this._createAlbum(album, cover, createdDate);

    // 2. Assign album to Category
    if (!album.categoryId) {
      throw new BadRequestException(
        `Couldn't assign album to Category. Category Id didn't specified`,
      );
    }

    await this._addAlbumToCategory(newAlbum.id, album.categoryId, createdDate);

    return res.status(HttpStatus.CREATED).send({
      id: newAlbum.id,
      createdDate: newAlbum.createdDate,
      titleEng: newAlbum.titleEng,
      titleRus: newAlbum.titleRus,
      cover: newAlbum.cover,
    });
  }

  private async getAlbumDTOById(albumId: string, lang): Promise<AlbumDTO> {
    const album: Album = await this._getAlbumById(albumId);

    return {
      id: album.id,
      title: lang === langs.rus ? album.titleRus : album.titleEng,
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

  private async _createAlbum(
    album: CreateAlbumDTO,
    cover: Image,
    createdDate: string,
  ): Promise<Album> {
    let newAlbum: Album;

    try {
      // todo [after release]: move Unnamed to constants
      newAlbum = await this.albumModel.create({
        titleEng: album.titleEng || 'Unnamed',
        titleRus: album.titleRus || 'Без названия',
        cover: cover.path,
        createdDate,
      } as Album);
    } catch (error) {
      throw new NotFoundException(`Couldn't create album: ${error.message}`);
    }

    if (!newAlbum) {
      throw new BadRequestException(`Couldn't create album`);
    }

    return newAlbum;
  }

  private async _addAlbumToCategory(
    albumId: string,
    categoryId: string,
    createdDate: string,
  ): Promise<AlbumCategory> {
    let albumCategory: AlbumCategory;

    try {
      albumCategory = await this.albumCategoryModel.create({
        albumId,
        categoryId,
        createdDate,
      } as AlbumCategory);
    } catch (error) {
      throw new NotFoundException(
        `Couldn't add album to category: ${error.message}`,
      );
    }

    if (!albumCategory) {
      throw new BadRequestException(`Couldn't add album to category`);
    }

    return albumCategory;
  }
}
