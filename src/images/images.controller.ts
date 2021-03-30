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
import { Roles } from '../decorators/roles.decorator';
import { Image } from '../models';

const maxUploadedFiles = +process.env.MAX_UPLOAD_IMAGES || 50;

@Controller('images')
export class ImagesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly imagesService: ImagesService,
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
    return new Promise((resolve) => setTimeout(() => {
      console.log(imageId);
      console.log(albumId);

      return resolve();
    }, 6000));
  }
}
