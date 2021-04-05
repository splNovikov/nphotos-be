import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Image, AlbumImage } from '../models';

@Injectable()
export class AlbumImageService {
  constructor(
    @InjectModel('AlbumImage')
    private readonly albumImageModel: Model<AlbumImage>,
  ) {}

  // todo [after release]: probably it significantly decreases performance. Pass albumId[] as parameter
  public async getAllAlbumImagesIds(): Promise<AlbumImage[]> {
    return this._getAllAlbumImagesIds();
  }

  public async getImageAlbumsIds(imageId: string): Promise<string[]> {
    return this._getImageAlbumsIds(imageId);
  }

  public async getAlbumImagesIds(albumId: string): Promise<string[]> {
    let albumImages: AlbumImage[];

    try {
      albumImages = await this.albumImageModel.find({ albumId });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't find album images`);
    }

    if (!albumImages) {
      throw new NotFoundException(`Couldn't find album images`);
    }

    return albumImages.map((albumImage: AlbumImage) => albumImage.imageId);
  }

  // Adding to AlbumsImages table (assign image to album)
  public async assignImagesToAlbum(
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
      Logger.error(error);
      throw new NotFoundException(
        `Couldn't assign images to album: ${error.message}`,
      );
    }

    if (!assignedImages) {
      throw new NotFoundException(`Couldn't assign images to album`);
    }

    return assignedImages;
  }

  public async deleteImageFromAlbum(imageId: string, albumId: string): Promise<void> {
    return this._deleteImageFromAlbum(imageId, albumId);
  }

  private async _getAllAlbumImagesIds(): Promise<AlbumImage[]> {
    let albumImages: AlbumImage[];

    try {
      albumImages = await this.albumImageModel.find().exec();
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't get albumImages`);
    }

    if (!albumImages) {
      throw new NotFoundException(`Couldn't get albumImages`);
    }

    return albumImages;
  }

  private async _getImageAlbumsIds(imageId: string): Promise<string[]> {
    let albumImages: AlbumImage[];

    try {
      albumImages = await this.albumImageModel.find({ imageId });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't find image's albums`);
    }

    if (!albumImages) {
      throw new NotFoundException(`Couldn't find image's albums`);
    }

    return albumImages.map(
      (albumImage: AlbumImage) => albumImage.albumId,
    );
  }

  private async _deleteImageFromAlbum(imageId: string, albumId: string): Promise<void> {
    try {
      await this.albumImageModel.deleteOne({ imageId, albumId });
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't delete image from album`);
    }
  }
}
