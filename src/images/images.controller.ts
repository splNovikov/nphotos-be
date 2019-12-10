import {
  Controller,
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

const maxUploadedFiles = 20;

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
    const uploadedImages = await this.filesService.imagesUpload(files);

    return this.imagesService.addImages(uploadedImages, albumId);
  }
}
