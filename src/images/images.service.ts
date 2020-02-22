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

    const images = await simultaneousPromises(
      imageIds.map(imageId => () => this.getImageDTOById(imageId, lang)),
      5,
    );

    return images
      ? images.reduce((acc, i) => (!i.error ? [...acc, i] : acc), [])
      : [];
  }

  // 1. Adds image to Mongo
  // 2. Assign image to Album in mongo
  public async addImagesWithPreview(
    images: Array<{
      previewPath: string;
      path: string;
      awsKey: string;
      previewAwsKey: string;
    }>,
    albumId: string,
  ): Promise<Image[]> {
    if (!albumId) {
      throw new BadRequestException(
        'Your request is missing details. No albumId specified',
      );
    }

    if (!images || !images.length) {
      throw new BadRequestException(
        'Your request is missing details. No images specified',
      );
    }

    const imagesWithUploadDate = images.map(
      i =>
        ({
          ...i,
          uploadDate: Date(),
        } as Image),
    );

    // add to Images table:
    const insertedImages = await this._addImages(imagesWithUploadDate);
    // add to AlbumsImages table (assign image to album)
    await this._assignImagesToAlbum(insertedImages, albumId);

    return insertedImages.map(
      i =>
        ({
          id: i.id,
          path: i.path,
          previewPath: i.previewPath,
        } as Image),
    );
  }

  public async addSingleImage(image: {
    path: string;
    awsKey: string;
  }): Promise<Image> {
    if (!image || !image.path) {
      throw new BadRequestException(
        'Your request is missing details. No cover specified',
      );
    }

    const imageWithUploadDate = { ...image, uploadDate: Date() } as Image;

    // add to Images table:
    return this._addImage(imageWithUploadDate);
  }

  private async getImageDTOById(imageId: string, lang): Promise<ImageDTO> {
    const image: Image = await this._getImageById(imageId);

    return {
      id: image.id,
      title: lang === langs.rus ? image.titleRus : image.titleEng,
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

  // add Multiple Images to Images table:
  private async _addImages(
    images: Array<{
      previewPath: string;
      path: string;
      awsKey: string;
      previewAwsKey: string;
      uploadDate?: string;
    }>,
  ): Promise<Image[]> {
    let insertedImages: Image[];

    try {
      insertedImages = await this.imageModel.insertMany(images);
    } catch (error) {
      throw new BadRequestException(`Couldn't add images: ${error.message}`);
    }

    if (!insertedImages) {
      throw new BadRequestException(`Couldn't add images`);
    }

    return insertedImages;
  }

  // add Single Image to Images table:
  private async _addImage(
    image: {
      previewPath: string;
      path: string;
      awsKey: string;
      previewAwsKey: string;
      uploadDate?: string;
    },
  ): Promise<Image> {
    let insertedImage: Image;

    try {
      insertedImage = await this.imageModel.create(image);
    } catch (error) {
      throw new BadRequestException(`Couldn't add image: ${error.message}`);
    }

    if (!insertedImage) {
      throw new BadRequestException(`Couldn't add image`);
    }

    return insertedImage;
  }

  // add to AlbumsImages table (assign image to album)
  private async _assignImagesToAlbum(
    images: Image[],
    albumId: string,
  ): Promise<AlbumImage[]> {
    const imagesToAssign: AlbumImage[] = images.map(
      i => ({ imageId: i.id, albumId } as AlbumImage),
    );
    let assignedImages: AlbumImage[];

    try {
      assignedImages = await this.albumImageModel.insertMany(imagesToAssign);
    } catch (error) {
      throw new NotFoundException(
        `Couldn't assign images to album: ${error.message}`,
      );
    }

    if (!assignedImages) {
      throw new NotFoundException(`Couldn't assign images to album`);
    }

    return assignedImages;
  }
}
