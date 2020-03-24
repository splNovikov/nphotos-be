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
}
