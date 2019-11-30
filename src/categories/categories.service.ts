import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, AlbumCategory, AlbumDTO, CategoryDTO } from '../models';
import { langs } from '../constants/langs.enum';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('AlbumCategory')
    private readonly albumCategoryModel: Model<AlbumCategory>,
    private readonly albumService: AlbumsService,
  ) {}

  public async getCategories(lang: langs = langs.eng): Promise<CategoryDTO[]> {
    // todo: try catch or specific function
    const categories = await this.categoryModel.find().exec();

    return categories.map(
      category => ({
        id: category.id,
        title: lang === langs.rus ? category.title_rus : category.title_eng,
        cover: category.cover,
      } as CategoryDTO),
    );
  }

  public async getCategory(
    categoryId: string,
    lang: langs = langs.eng,
  ): Promise<CategoryDTO> {
    const category: Category = await this._getCategory(categoryId);
    const albums: AlbumDTO[] = await this._getCategoryAlbums(categoryId, lang);

    return {
      id: category.id,
      title: lang === langs.rus ? category.title_rus : category.title_eng,
      cover: category.cover,
      albums,
    };
  }

  private async _getCategory(categoryId: string): Promise<Category> {
    let category: Category;

    try {
      category = await this.categoryModel.findById(categoryId);
    } catch (error) {
      throw new NotFoundException('Couldn\'t find category');
    }

    if (!category) {
      throw new NotFoundException('Couldn\'t find category');
    }

    return category;
  }

  // todo: try catch
  private async _getCategoryAlbums(
    categoryId: string,
    lang: langs,
  ): Promise<AlbumDTO[]> {
    const categoryAlbums = await this.albumCategoryModel.find({ categoryId });
    const albumsIds = categoryAlbums.map(
      (albumCategory: AlbumCategory) => albumCategory.albumId,
    );
    const albumsCount = albumsIds.length;
    const albums = [];

    for (let i = 0; i < albumsCount; i++) {
      const album = await this.albumService.getSimpleAlbum(albumsIds[i], lang);
      albums.push(album);
    }

    return albums;
  }
}
