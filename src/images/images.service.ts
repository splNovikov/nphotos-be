import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Image } from '../models';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}

  public async getImages(albumId: string): Promise<Image[]> {
    let images: Image[];

    try {
      images = await this.imageModel.find({ albumId });
    } catch (error) {
      throw new NotFoundException('Couldn\'t find images');
    }

    if (!images) {
      throw new NotFoundException('Couldn\'t find images');
    }

    return images;
  }

  // todo: albumId should NOT be stored in images table. We need albumsImages table
  // todo: if no albumId - throw exception
  // todo: uploadedDate to Mongo
  public async addImages(files: any, albumId: string): Promise<Image[]> {
    const newImages = files.map(f => ({
      // todo: should be resized image
      path: f.location,
      // todo: should be preview
      previewPath: f.location,
      albumId,
    }));

    return await this._addImages(newImages);
  }

  private async _addImages(images: Image[]): Promise<Image[]> {
    let insertedImages: Image[];

    try {
      insertedImages = await this.imageModel.insertMany(images);
    } catch (error) {
      throw new NotFoundException('Couldn\'t add images');
    }

    if (!insertedImages) {
      throw new NotFoundException('Couldn\'t add images');
    }

    return insertedImages;
  }
}
