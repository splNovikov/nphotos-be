import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImagesService } from '../images/images.service';
import { CategoriesService } from '../categories/categories.service';
import { AlbumCategoryService } from '../albumCategory/albumCategory.service';
import { AlbumImageService } from '../albumImage/albumImage.service';
import {
  Album,
  AlbumCategory,
  AlbumDTO,
  AlbumExtraDTO,
  AlbumFullDTO,
  AlbumImage,
  CategoryShortDTO,
  CreateAlbumDTO,
  ImageDTO,
} from '../models';
import { simultaneousPromises } from '../utils/multiPromises';
import { getTitleByLang } from '../utils/lang';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
    private readonly imagesService: ImagesService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    private readonly albumCategoryService: AlbumCategoryService,
    private readonly albumImageService: AlbumImageService,
  ) {}

  public async getAlbumsDTO(lang: langs): Promise<AlbumExtraDTO[]> {
    const [albums, allAlbumCategories, shortCategories, allAlbumImages]: [
      Album[],
      AlbumCategory[],
      CategoryShortDTO[],
      AlbumImage[],
    ] = await Promise.all([
      this._getAlbums(),
      this.albumCategoryService.getAllCategoryAlbumsIds(),
      this.categoriesService.getCategoriesShort(lang),
      this.albumImageService.getAllAlbumImagesIds(),
    ]);

    return this._mapAlbumsToDTO(
      albums,
      lang,
      allAlbumCategories,
      shortCategories,
      allAlbumImages,
    );
  }

  public async getFullAlbumDTOById(
    albumId: string,
    lang: langs,
  ): Promise<AlbumFullDTO> {
    const [album, images, allAlbumCategories, shortCategories]: [
      AlbumDTO,
      ImageDTO[],
      AlbumCategory[],
      CategoryShortDTO[],
    ] = await Promise.all([
      this.getAlbumDTOById(albumId, lang),
      this.imagesService.getImagesDTOByAlbumId(albumId, lang),
      this.albumCategoryService.getAllCategoryAlbumsIds(),
      this.categoriesService.getCategoriesShort(lang),
    ]);

    return {
      ...album,
      images,
      categories: this._getCategoriesShortForAlbum(
        allAlbumCategories,
        shortCategories,
        albumId,
      ),
      imagesCount: images.length,
    };
  }

  public async getAlbumsDTOByCategoryId(
    categoryId: string,
    lang,
  ): Promise<AlbumExtraDTO[]> {
    const [albumsIds, allAlbumCategories, shortCategories, allAlbumImages]: [
      string[],
      AlbumCategory[],
      CategoryShortDTO[],
      AlbumImage[],
    ] = await Promise.all([
      this.albumCategoryService.getCategoryAlbumsIds(categoryId),
      this.albumCategoryService.getAllCategoryAlbumsIds(),
      this.categoriesService.getCategoriesShort(lang),
      this.albumImageService.getAllAlbumImagesIds(),
    ]);

    const albums = await simultaneousPromises(
      albumsIds.map(albumId => () => this.getAlbumDTOById(albumId, lang)),
      5,
    );

    return this._mapAlbumsToDTO(
      albums,
      lang,
      allAlbumCategories,
      shortCategories,
      allAlbumImages,
    );
  }

  public async createAlbum(
    album: CreateAlbumDTO,
    categoryId: string,
  ): Promise<AlbumDTO> {
    const createdDate = Date();

    // // 1. Create Album
    const createdAlbum = await this._createAlbum(album, createdDate);

    // 2. Assign album to Category
    if (categoryId) {
      await this.albumCategoryService.addAlbumToCategory(
        createdAlbum.id,
        categoryId,
        createdDate,
      );
    }

    return this.getAlbumDTOById(createdAlbum.id);
  }

  public async updateAlbum(
    albumId: string,
    album: AlbumDTO,
  ): Promise<AlbumDTO> {
    await this._updateAlbum(albumId, album);

    return this.getAlbumDTOById(albumId);
  }

  private async getAlbumDTOById(albumId: string, lang?): Promise<AlbumDTO> {
    const album: Album = await this._getAlbumById(albumId);

    return {
      id: album.id,
      title: getTitleByLang(album, lang),
      titleEng: album.titleEng,
      titleRus: album.titleRus,
      cover: album.cover,
    };
  }

  private _mapAlbumsToDTO(
    albums: Album[],
    lang,
    allAlbumCategories: AlbumCategory[],
    shortCategories: CategoryShortDTO[],
    allAlbumImages: AlbumImage[],
  ): AlbumExtraDTO[] {
    if (!albums) {
      return [];
    }
    return albums.map(album => ({
      id: album.id,
      title: getTitleByLang(album, lang),
      titleEng: album.titleEng,
      titleRus: album.titleRus,
      cover: album.cover,
      categories: this._getCategoriesShortForAlbum(
        allAlbumCategories,
        shortCategories,
        album.id,
      ),
      imagesCount: this._getImagesCount(allAlbumImages, album.id),
    }));
  }

  // get Albums Count From Single Time Loaded AlbumCategory Array
  private _getImagesCount(
    allAlbumImages: AlbumImage[],
    albumId: string,
  ): number {
    return allAlbumImages.filter(ai => ai.albumId === albumId).length;
  }

  // get CategoriesShort for Album From Single Time Loaded ShortCategories Array
  private _getCategoriesShortForAlbum(
    allAlbumCategories: AlbumCategory[],
    shortCategories: CategoryShortDTO[],
    albumId: string,
  ): CategoryShortDTO[] {
    const albumCategories = allAlbumCategories.filter(
      ac => ac.albumId === albumId,
    );

    return albumCategories.map(ac =>
      shortCategories.find(sc => sc.id === ac.categoryId),
    );
  }

  private async _getAlbums(): Promise<Album[]> {
    let albums: Album[];

    try {
      albums = await this.albumModel.find().exec();
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't find albums`);
    }

    if (!albums) {
      throw new NotFoundException(`Couldn't find albums`);
    }


    albums = albums.sort((firstAl, secondAl) =>
      new Date(secondAl.createdDate).getTime() - new Date(firstAl.createdDate).getTime());

    return albums;
  }

  // created separate function 'findAlbum' - return Mongoose object Album
  // Mongoose object have methods like 'save', so we created this function for reuse
  private async _getAlbumById(id: string): Promise<Album> {
    let album: Album;

    try {
      album = await this.albumModel.findById(id);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't find album: ${error.message}`);
    }

    if (!album) {
      throw new NotFoundException(`Couldn't find album`);
    }

    return album;
  }

  private async _createAlbum(
    album: CreateAlbumDTO,
    createdDate: string,
  ): Promise<Album> {
    let newAlbum: Album;

    try {
      // todo [after release]: move Unnamed to constants
      newAlbum = await this.albumModel.create({
        titleEng: album.titleEng || 'Unnamed',
        titleRus: album.titleRus || 'Без названия',
        cover: album.cover,
        createdDate,
      } as Album);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't create album: ${error.message}`);
    }

    if (!newAlbum) {
      throw new BadRequestException(`Couldn't create album`);
    }

    return newAlbum;
  }

  private async _updateAlbum(albumId: string, album: AlbumDTO): Promise<Album> {
    let updatedAlbum: Album;

    try {
      const albumToUpdate = await this._getAlbumById(albumId);
      updatedAlbum = await albumToUpdate.updateOne({
        titleRus: album.titleRus,
        titleEng: album.titleEng,
        cover: album.cover,
      });
    } catch (error) {
      Logger.error(error);
      throw new InternalServerErrorException(`Couldn't update album`);
    }

    if (!updatedAlbum) {
      throw new InternalServerErrorException(`Couldn't update album`);
    }

    return updatedAlbum;
  }
}
