import {
  Controller,
  Delete,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { FilesService } from '../files/files.service';
import { ImagesService } from './images.service';
import { AlbumImageService } from '../albumImage/albumImage.service';
import { Roles } from '../decorators/roles.decorator';
import { Image } from '../models';

const maxUploadedFiles = +process.env.MAX_UPLOAD_IMAGES || 50;

@Controller('images')
export class ImagesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly imagesService: ImagesService,
    private readonly albumImageService: AlbumImageService,
  ) {}

  @Post()
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('image', maxUploadedFiles))
  async update(@UploadedFiles() files, @Query() { albumId }): Promise<Image[]> {
    // 1. Add to Storage
    const uploadedImages = await this.filesService.imagesUpload(files);

    // 2. Add to DB and assign to album
    return this.imagesService.addImagesWithPreview(uploadedImages, albumId);
  }

  @Delete()
  @Roles('admin')
  async delete(@Query() { imageId, albumId }): Promise<void> {
    const [image, albumIds] = await Promise.all([
      // 1. get image
      this.imagesService.getImageById(imageId),
      // 2. Check how many usages do we have:
      this.albumImageService.getImageAlbumsIds(imageId),
      // 3. Delete image from DB and from album-images table
      this.albumImageService.deleteImageFromAlbum(imageId, albumId)
    ]);

    // If there is only one usage - delete from s3 and from images table
    if (albumIds.length === 1) {
      await Promise.all([
        // 4. Delete from Storage
        this.filesService.deleteImage(image),
        // 5. and delete from images table
        this.imagesService.deleteImageById(imageId)
      ]);
    }
  }
}
