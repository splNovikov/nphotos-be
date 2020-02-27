import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
          title: lang === langs.rus ? category.titleRus : category.titleEng,
          cover: category.cover,
        } as CategoryDTO),
    );
  }

  public async getCategoryDTO(categoryId: string, lang?): Promise<CategoryDTO> {
    const category: Category = await this._getCategory(categoryId);
    const albums: AlbumDTO[] = await this.albumService.getAlbumsDTOByCategoryId(
      categoryId,
      lang,
    );

    return {
      id: category.id,
      title: lang === langs.rus ? category.titleRus : category.titleEng,
      titleRus: category.titleRus,
      titleEng: category.titleEng,
      cover: category.cover,
      albums,
    };
  }

  public async updateCategory(
    categoryId: string,
    category: CategoryDTO,
  ): Promise<CategoryDTO> {
    await this._updateCategory(categoryId, category);

    return this.getCategoryDTO(categoryId);
  }

  public async createCategory(
    category: CategoryDTO,
  ): Promise<CategoryDTO> {
    const createdCategory: Category = await this._createCategory(category);

    return this.getCategoryDTO(createdCategory.id);
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

  private async _updateCategory(
    categoryId: string,
    category: CategoryDTO,
  ): Promise<Category> {
    let updatedCategory: Category;

    try {
      const categoryToUpdate = await this._getCategory(categoryId);
      updatedCategory = await categoryToUpdate.updateOne({
        titleRus: category.titleRus,
        titleEng: category.titleEng,
        cover: category.cover,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Couldn't update category`);
    }

    if (!updatedCategory) {
      throw new InternalServerErrorException(`Couldn't update category`);
    }

    return updatedCategory;
  }

  private async _createCategory(category: CategoryDTO): Promise<Category> {
    let createdCategory: Category;

    try {
      createdCategory = await this.categoryModel.create({
        titleRus: category.titleRus,
        titleEng: category.titleEng,
        cover: category.cover,
      });
    } catch (error) {
      throw new InternalServerErrorException(`Couldn't create category`);
    }

    if (!createdCategory) {
      throw new InternalServerErrorException(`Couldn't create category`);
    }

    return createdCategory;
  }
}
