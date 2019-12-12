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

  // todo: add DTO everywhere where we return DTOs
  public async getCategories(lang): Promise<CategoryDTO[]> {
    const categories = await this._getCategories();

    return categories.map(
      category =>
        ({
          id: category.id,
          title: lang === langs.rus ? category.title_rus : category.title_eng,
          cover: category.cover,
        } as CategoryDTO),
    );
  }

  public async getCategory(categoryId: string, lang): Promise<CategoryDTO> {
    const category: Category = await this._getCategory(categoryId);
    // todo: move to albums service:
    const albums: AlbumDTO[] = await this._getCategoryAlbums(categoryId, lang);

    return {
      id: category.id,
      title: lang === langs.rus ? category.title_rus : category.title_eng,
      cover: category.cover,
      albums,
    };
  }

  private async _getCategories(): Promise<Category[]> {
    let categories: Category[];

    try {
      categories = await this.categoryModel.find().exec();
    } catch (error) {
      throw new NotFoundException(`Couldn't find categories`);
    }

    if (!categories) {
      throw new NotFoundException(`Couldn't find categories`);
    }

    return categories;
  }

  private async _getCategory(categoryId: string): Promise<Category> {
    let category: Category;

    try {
      category = await this.categoryModel.findById(categoryId);
    } catch (error) {
      throw new NotFoundException(`Couldn't find category`);
    }

    if (!category) {
      throw new NotFoundException(`Couldn't find category`);
    }

    return category;
  }

  private async _getCategoryAlbums(
    categoryId: string,
    lang,
  ): Promise<AlbumDTO[]> {
    const albumsIds = await this._getCategoryAlbumsIds(categoryId);
    const albums = [];

    for (const albumId of albumsIds) {
      const album = await this.albumService.getAlbumDTOById(albumId, lang);
      albums.push(album);
    }

    return albums;
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
