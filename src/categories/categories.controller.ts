import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

import { CategoryDTO } from '../models';
import { langs } from '../constants/langs.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getContacts(@Query('lang') lang: langs = langs.eng): Promise<CategoryDTO[]> {
    return this.categoriesService.getCategoriesDTO(lang);
  }

  @Get(':id')
  getAlbum(
    @Param('id') categoryId,
    @Query('lang') lang: langs = langs.eng,
  ): Promise<CategoryDTO> {
    return this.categoriesService.getCategoryDTO(categoryId, lang);
  }
}
