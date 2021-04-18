import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AlbumCategory } from '../models';

@Injectable()
export class AlbumCategoryService {
  constructor(
    @InjectModel('AlbumCategory')
    private readonly albumCategoryModel: Model<AlbumCategory>,
  ) {}

  // todo [after release]: probably it significantly decreases performance. Pass categoryId[] as parameter
  public async getAllCategoryAlbumsIds(): Promise<AlbumCategory[]> {
    return await this._getAllCategoryAlbumsIds();
  }

  public async getCategoryAlbumsIds(categoryId: string): Promise<string[]> {
    return await this._getCategoryAlbumsIds(categoryId);
  }

  public async getAlbumCategoriesIds(albumId: string): Promise<string[]> {
    return await this._getAlbumCategoriesIds(albumId);
  }

  public async addAlbumToCategory(
    albumId: string,
    categoryId: string,
    createdDate: string,
  ): Promise<AlbumCategory> {
    return await this._addAlbumToCategory(albumId, categoryId, createdDate);
  }

  public async deleteAlbumFromCategory(
    albumId: string,
    categoryId: string,
  ): Promise<void> {
    return this._deleteAlbumFromCategory(albumId, categoryId);
  }

  public async deleteAlbumFromAllCategories(albumId: string): Promise<void> {
    return this._deleteAlbumFromAllCategories(albumId);
  }

  private async _getAllCategoryAlbumsIds(): Promise<AlbumCategory[]> {
    let categoryAlbums: AlbumCategory[];

    try {
      categoryAlbums = await this.albumCategoryModel.find().exec();
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't get categoryAlbums`);
    }

    if (!categoryAlbums) {
      throw new NotFoundException(`Couldn't get categoryAlbums`);
    }

    return categoryAlbums;
  }

  private async _getCategoryAlbumsIds(categoryId: string): Promise<string[]> {
    let categoryAlbums: AlbumCategory[];

    try {
      categoryAlbums = await this.albumCategoryModel.find({ categoryId });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't find category albums`);
    }

    if (!categoryAlbums) {
      throw new NotFoundException(`Couldn't find category albums`);
    }

    return categoryAlbums.map(
      (albumCategory: AlbumCategory) => albumCategory.albumId,
    );
  }

  private async _getAlbumCategoriesIds(albumId: string): Promise<string[]> {
    let albumCategories: AlbumCategory[];

    try {
      albumCategories = await this.albumCategoryModel.find({ albumId });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't find album's categories`);
    }

    if (!albumCategories) {
      throw new NotFoundException(`Couldn't find album's categories`);
    }

    return albumCategories.map(
      (albumCategory: AlbumCategory) => albumCategory.categoryId,
    );
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
      Logger.error(error);
      throw new NotFoundException(
        `Couldn't add album to category: ${error.message}`,
      );
    }

    if (!albumCategory) {
      throw new BadRequestException(`Couldn't add album to category`);
    }

    return albumCategory;
  }

  private async _deleteAlbumFromCategory(
    albumId: string,
    categoryId: string,
  ): Promise<void> {
    try {
      await this.albumCategoryModel.deleteOne({ albumId, categoryId });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't delete album from category`);
    }
  }

  private async _deleteAlbumFromAllCategories(albumId: string): Promise<void> {
    try {
      await this.albumCategoryModel.deleteMany({ albumId });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't delete album from categories`);
    }
  }
}
