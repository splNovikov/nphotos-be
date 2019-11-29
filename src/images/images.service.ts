import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Image, ImageDTO } from '../models/image';
import { langs } from '../constants/langs.enum';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
  ) {}

  async getImages(albumId: string, lang: langs = langs.eng): Promise<ImageDTO[]> {
    const images = await this.findImages(albumId);

    return images.map(
      image =>
        new ImageDTO(
          image.id,
          lang === langs.rus ? image.title_rus : image.title_eng,
          image.path,
          image.previewPath,
        ),
    );
  }

  // addImages = (albumId, images) => {
  //   // todo: if no albumId - throw exception
  // }

  private async findImages(albumId: string): Promise<Image[]> {
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
}
