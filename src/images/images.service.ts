import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
      throw new NotFoundException(`Couldn't find images`);
    }

    if (!images) {
      throw new NotFoundException(`Couldn't find images`);
    }

    return images;
  }

  // todo: albumId should NOT be stored in images table. We need albumsImages table
  // todo: uploadedDate to Mongo
  public async addImages(
    images: Array<{ previewPath: string; path: string }>,
    albumId: string,
  ): Promise<Image[]> {
    if (!albumId) {
      throw new BadRequestException(
        'Your request is missing details. No albumId specified',
      );
    }
    const newImages = images.map(f => ({ ...f, albumId } as Image));
    const insertedImages = await this._addImages(newImages);

    return insertedImages.map(i => ({
      id: i.id,
      // todo: when we add albumsImages - albumId will not exist here
      albumId: i.albumId,
      path: i.path,
      previewPath: i.previewPath,
    } as Image));
  }

  private async _addImages(images: Image[]): Promise<Image[]> {
    let insertedImages: Image[];

    try {
      insertedImages = await this.imageModel.insertMany(images);
    } catch (error) {
      throw new NotFoundException(`Couldn't add images: ${error.message}`);
    }

    if (!insertedImages) {
      throw new NotFoundException(`Couldn't add images`);
    }

    return insertedImages;
  }
}
