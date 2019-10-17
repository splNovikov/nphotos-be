import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, CategoryDTO } from '../models/category';
import { AlbumCategory } from '../models/albumCategory';
import { langs } from '../constants/langs.enum';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @InjectModel('AlbumCategory') private readonly albumCategoryModel: Model<AlbumCategory>) {
  }

  async getCategories(lang: langs = langs.eng): Promise<CategoryDTO[]> {
    const categories = await this.categoryModel.find().exec();

    return categories.map(category => new CategoryDTO(
      category.id,
      lang === langs.rus ? category.title_rus : category.title_eng,
      category.cover,
      0,
      // this.getCategoryAlbumsIds(category.id),
    ));
  }

  private async getCategoryAlbumsIds(categoryId: string): Promise<AlbumCategory[]> {
    return await this.albumCategoryModel.find({ categoryId });
  }
}
