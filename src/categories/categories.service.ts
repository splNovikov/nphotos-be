import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, CategoryDTO } from '../models/category';
import { AlbumCategory } from '../models/albumCategory';
import { AlbumDTO } from '../models/albumDTO';
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

  async getCategories(lang: langs = langs.eng): Promise<CategoryDTO[]> {
    const categories = await this.categoryModel.find().exec();

    return categories.map(
      category =>
        new CategoryDTO(
          category.id,
          lang === langs.rus ? category.title_rus : category.title_eng,
          category.cover,
        ),
    );
  }

  async getCategory(
    categoryId: string,
    lang: langs = langs.eng,
  ): Promise<CategoryDTO> {
    const category: Category = await this.findCategory(categoryId);
    const albums: AlbumDTO[] = await this.findCategoryAlbums(categoryId, lang);

    return new CategoryDTO(
      category.id,
      lang === langs.rus ? category.title_rus : category.title_eng,
      category.cover,
      albums,
    );
  }

  private async findCategory(categoryId: string): Promise<Category> {
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

  private async findCategoryAlbums(
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
