import {
  BadRequestException,
  Injectable,
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

  public async getAllCategoryAlbumsIds(): Promise<AlbumCategory[]> {
    return await this._getAllCategoryAlbumsIds();
  }

  public async getCategoryAlbumsIds(categoryId: string): Promise<string[]> {
    return await this._getCategoryAlbumsIds(categoryId);
  }

  public async addAlbumToCategory(
    albumId: string,
    categoryId: string,
    createdDate: string,
  ): Promise<AlbumCategory> {
    return await this._addAlbumToCategory(albumId, categoryId, createdDate);
  }

  private async _getAllCategoryAlbumsIds(): Promise<AlbumCategory[]> {
    let categoryAlbums: AlbumCategory[];

    try {
      categoryAlbums = await this.albumCategoryModel.find().exec();
    } catch (error) {
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
      throw new NotFoundException(`Couldn't find category albums`);
    }

    if (!categoryAlbums) {
      throw new NotFoundException(`Couldn't find category albums`);
    }

    return categoryAlbums.map(
      (albumCategory: AlbumCategory) => albumCategory.albumId,
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
      throw new NotFoundException(
        `Couldn't add album to category: ${error.message}`,
      );
    }

    if (!albumCategory) {
      throw new BadRequestException(`Couldn't add album to category`);
    }

    return albumCategory;
  }
}
