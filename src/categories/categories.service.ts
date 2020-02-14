import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, AlbumDTO, CategoryDTO } from '../models';
import { langs } from '../constants/langs.enum';
import { AlbumsService } from '../albums/albums.service';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    private readonly albumService: AlbumsService,
  ) {}

  public async getCategoriesDTO(lang): Promise<CategoryDTO[]> {
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

  public async getCategoryDTO(categoryId: string, lang): Promise<CategoryDTO> {
    const category: Category = await this._getCategory(categoryId);
    const albums: AlbumDTO[] = await this.albumService.getAlbumsDTOByCategoryId(
      categoryId,
      lang,
    );

    return {
      id: category.id,
      title: lang === langs.rus ? category.title_rus : category.title_eng,
      title_rus: category.title_rus,
      title_eng: category.title_eng,
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
}
