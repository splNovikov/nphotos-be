import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AlbumImageService } from '../albumImage/albumImage.service';
import { FilesService } from '../files/files.service';
import { Image, ImageDTO } from '../models';
import { simultaneousPromises } from '../utils/multiPromises';
import { getTitleByLang } from '../utils/lang';

@Injectable()
export class ImagesService {
  constructor(
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    private readonly albumImageService: AlbumImageService,
    private readonly filesService: FilesService,
  ) {}

  public async getImagesDTOByAlbumId(
    albumId: string,
    lang,
  ): Promise<ImageDTO[]> {
    const imageIds = await this.albumImageService.getAlbumImagesIds(albumId);

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
    images: {
      previewPath: string;
      path: string;
      awsKey: string;
      previewAwsKey: string;
    }[],
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
    await this.albumImageService.assignImagesToAlbum(insertedImages, albumId);

    return insertedImages.map(
      i =>
        ({
          id: i.id,
          path: i.path,
          previewPath: i.previewPath,
        } as Image),
    );
  }

  // Delete from album-images table and (if possible) from images table and S3:
  public async deleteImageConditionally(
    imageId: string,
    albumId: string,
  ): Promise<void> {
    // Delete image from album-images table
    await this.albumImageService.deleteImageFromAlbum(imageId, albumId);

    // Check how many usages in Albums do we have:
    const albumIds = await this.albumImageService.getImageAlbumsIds(imageId);

    // If there is no usage - delete everywhere
    if (!albumIds.length) {
      await this._deleteImagePermanently(imageId);
    }
  }

  private async getImageDTOById(imageId: string, lang): Promise<ImageDTO> {
    const image: Image = await this._getImageById(imageId);

    return {
      id: image.id,
      title: getTitleByLang(image, lang),
      path: image.path,
      previewPath: image.previewPath,
    };
  }

  private async _deleteImagePermanently(imageId: string): Promise<void> {
    const image: Image = await this._getImageById(imageId);

    await Promise.all([
      // Delete from S3 Storage
      this.filesService.deleteImage(image),
      // Delete from images table
      this._deleteImageById(image.id),
      // Delete all instances if imageId in image-album table
      this.albumImageService.deleteImageFromAllAlbums(image.id),
    ]);
  }

  private async _getImageById(id: string): Promise<Image> {
    let image: Image;

    try {
      image = await this.imageModel.findById(id);
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't find image: ${error.message}`);
    }

    if (!image) {
      throw new NotFoundException(`Couldn't find image`);
    }

    return image;
  }

  // add Multiple Images to Images table:
  private async _addImages(
    images: {
      previewPath: string;
      path: string;
      awsKey: string;
      previewAwsKey: string;
      uploadDate?: string;
    }[],
  ): Promise<Image[]> {
    let insertedImages: Image[];

    try {
      insertedImages = await this.imageModel.insertMany(images);
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(`Couldn't add images: ${error.message}`);
    }

    if (!insertedImages) {
      throw new BadRequestException(`Couldn't add images`);
    }

    return insertedImages;
  }

  private async _deleteImageById(id: string): Promise<void> {
    try {
      await this.imageModel.deleteOne({ id });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't delete image`);
    }
  }
}
