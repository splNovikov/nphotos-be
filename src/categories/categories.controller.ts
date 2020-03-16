import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CategoriesService } from './categories.service';
import { FilesService } from '../files/files.service';
import { ImagesService } from '../images/images.service';
import { CategoryDTO } from '../models';
import { Roles } from '../decorators/roles.decorator';
import { langs } from '../constants/langs.enum';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly categoriesService: CategoriesService,
    private readonly imagesService: ImagesService,
  ) {}

  @Get()
  getCategories(@Query('lang') lang: langs): Promise<CategoryDTO[]> {
    return this.categoriesService.getCategoriesDTO(lang);
  }

  @Get(':id')
  getCategory(
    @Param('id') categoryId,
    @Query('lang') lang: langs,
  ): Promise<CategoryDTO> {
    return this.categoriesService.getCategoryDTO(categoryId, lang);
  }

  @Put(':id')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('cover'))
  async updateCategory(
    @Param('id') categoryId: string,
    @UploadedFile() cover,
    @Body() category: CategoryDTO,
  ): Promise<CategoryDTO> {
    if (cover) {
      // Add Cover to Storage
      const uploadedCover = await this.filesService.coverUpload(cover);

      category = {
        ...category,
        cover: uploadedCover.path,
      };
    }

    return this.categoriesService.updateCategory(categoryId, category);
  }

  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('cover'))
  async create(
    @Body() category: CategoryDTO,
    @UploadedFile() cover,
  ): Promise<CategoryDTO> {
    if (cover) {
      // Add Cover to Storage
      const uploadedCover = await this.filesService.coverUpload(cover);

      category = {
        ...category,
        cover: uploadedCover.path,
      };
    }

    return this.categoriesService.createCategory(category);
  }
}
