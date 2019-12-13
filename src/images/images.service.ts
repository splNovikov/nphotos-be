import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Image, ImageDTO, AlbumImage } from '../models';
import { langs } from '../constants/langs.enum';
import { simultaneousPromises } from '../utils/multiPromises';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    @InjectModel('AlbumImage')
    private readonly albumImageModel: Model<AlbumImage>,
  ) {}

  public async getImagesDTOByAlbumId(
    albumId: string,
    lang,
  ): Promise<ImageDTO[]> {
    const imageIds = await this._getAlbumImagesIds(albumId);

    return await simultaneousPromises(
      imageIds.map(imageId => () => this.getImageDTOById(imageId, lang)),
      5,
    );
  }

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

    return insertedImages.map(
      i =>
        ({
          id: i.id,
          // todo: when we add albumsImages - albumId will not exist here
          albumId: i.albumId,
          path: i.path,
          previewPath: i.previewPath,
        } as Image),
    );
  }

  private async getImageDTOById(imageId: string, lang): Promise<ImageDTO> {
    const image: Image = await this._getImageById(imageId);

    return {
      id: image.id,
      title: lang === langs.rus ? image.title_rus : image.title_eng,
      path: image.path,
      previewPath: image.previewPath,
    };
  }

  private async _getAlbumImagesIds(albumId: string): Promise<string[]> {
    let albumImages: AlbumImage[];

    try {
      albumImages = await this.albumImageModel.find({ albumId });
    } catch (error) {
      throw new NotFoundException(`Couldn't find album images`);
    }

    if (!albumImages) {
      throw new NotFoundException(`Couldn't find album images`);
    }

    return albumImages.map((albumImage: AlbumImage) => albumImage.imageId);
  }

  private async _getImageById(id: string): Promise<Image> {
    let image: Image;

    try {
      image = await this.imageModel.findById(id);
    } catch (error) {
      throw new NotFoundException(`Couldn't find image: ${error.message}`);
    }

    if (!image) {
      throw new NotFoundException(`Couldn't find image`);
    }

    return image;
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
