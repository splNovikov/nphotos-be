import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  Category,
  AlbumDTO,
  CategoryDTO,
  AlbumCategory,
  CategoryShortDTO,
} from '../models';
import { AlbumsService } from '../albums/albums.service';
import { AlbumCategoryService } from '../albumCategory/albumCategory.service';
import { getTitleByLang } from '../utils/lang';
import { langs } from '../constants/langs.enum';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel('Category') private readonly categoryModel: Model<Category>,
    @Inject(forwardRef(() => AlbumsService))
    private readonly albumService: AlbumsService,
    private readonly albumCategoryService: AlbumCategoryService,
  ) {}

  public async getCategoriesShort(lang: langs): Promise<CategoryShortDTO[]> {
    const categories = await this._getCategories();

    return categories.map(
      category =>
        ({
          id: category.id,
          title: getTitleByLang(category, lang),
          cover: category.cover,
        } as CategoryShortDTO),
    );
  }

  public async getCategoriesDTO(lang): Promise<CategoryDTO[]> {
    const [categories, allAlbumCategories]: [
      Category[],
      AlbumCategory[],
    ] = await Promise.all([
      this._getCategories(),
      this.albumCategoryService.getAllCategoryAlbumsIds(),
    ]);

    return categories.map(
      category =>
        ({
          id: category.id,
          title: getTitleByLang(category, lang),
          cover: category.cover,
          albumsCount: this._getAlbumsCount(allAlbumCategories, category.id),
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
      title: getTitleByLang(category, lang),
      titleRus: category.titleRus,
      titleEng: category.titleEng,
      cover: category.cover,
      albums,
      albumsCount: albums && albums.length,
    };
  }

  public async updateCategory(
    categoryId: string,
    category: CategoryDTO,
  ): Promise<CategoryDTO> {
    await this._updateCategory(categoryId, category);

    return this.getCategoryDTO(categoryId);
  }

  public async createCategory(category: CategoryDTO): Promise<CategoryDTO> {
    const createdCategory: Category = await this._createCategory(category);

    return this.getCategoryDTO(createdCategory.id);
  }

  // get Albums Count From Single Time Loaded AlbumCategory Array
  private _getAlbumsCount(
    allAlbumCategories: AlbumCategory[],
    categoryId: string,
  ): number {
    return allAlbumCategories.filter(ac => ac.categoryId === categoryId).length;
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
