import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImagesService } from '../images/images.service';
import { CategoriesService } from '../categories/categories.service';
import { AlbumCategoryService } from '../albumCategory/albumCategory.service';
import {
  Album,
  AlbumCategory,
  AlbumDTO,
  CategoryShortDTO,
  CreateAlbumDTO,
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
  ) {}

  public async getAlbumsDTO(lang: langs): Promise<AlbumDTO[]> {
    const albums: Album[] = await this._getAlbums();
    const allAlbumCategories: AlbumCategory[] = await this.albumCategoryService.getAllCategoryAlbumsIds();
    const shortCategories: CategoryShortDTO[] = await this.categoriesService.getCategoriesShort(
      lang,
    );

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
    }));
  }

  public async getFullAlbumDTOById(
    albumId: string,
    lang: langs,
  ): Promise<AlbumDTO> {
    const [album, images] = await Promise.all([
      this.getAlbumDTOById(albumId, lang),
      this.imagesService.getImagesDTOByAlbumId(albumId, lang),
    ]);

    return { ...album, images };
  }

  // todo: add short categories
  public async getAlbumsDTOByCategoryId(
    categoryId: string,
    lang,
  ): Promise<AlbumDTO[]> {
    const albumsIds = await this.albumCategoryService.getCategoryAlbumsIds(
      categoryId,
    );

    return await simultaneousPromises(
      albumsIds.map(albumId => () => this.getAlbumDTOById(albumId, lang)),
      5,
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
      throw new InternalServerErrorException(`Couldn't update album`);
    }

    if (!updatedAlbum) {
      throw new InternalServerErrorException(`Couldn't update album`);
    }

    return updatedAlbum;
  }
}
