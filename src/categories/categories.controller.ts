import { Body, Controller, Get, Param, Put, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

import { CategoryDTO } from '../models';
import { langs } from '../constants/langs.enum';
import { Roles } from '../decorators/roles.decorator';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories(
    @Query('lang') lang: langs = langs.eng,
  ): Promise<CategoryDTO[]> {
    return this.categoriesService.getCategoriesDTO(lang);
  }

  @Get(':id')
  getCategory(
    @Param('id') categoryId,
    @Query('lang') lang: langs = langs.eng,
  ): Promise<CategoryDTO> {
    return this.categoriesService.getCategoryDTO(categoryId, lang);
  }

  @Put(':id')
  @Roles('admin')
  async updateCategory(
    @Param('id') categoryId: string,
    @Body() category: CategoryDTO,
  ): Promise<CategoryDTO> {
    return this.categoriesService.updateCategory(categoryId, category);
  }
}
