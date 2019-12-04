import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { FilesService } from '../files/files.service';
import { Roles } from '../decorators/roles.decorator';

const maxUploadedFiles = 20;

@Controller('images')
export class ImagesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('image', maxUploadedFiles))
  // todo: any
  async update(@UploadedFiles() files): Promise<any> {
    return this.filesService.imagesUpload(files);
  }
}
