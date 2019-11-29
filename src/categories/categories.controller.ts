import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

import { CategoryDTO } from '../models/categoryDTO';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getContacts(@Query('lang') lang): Promise<CategoryDTO[]> {
    return this.categoriesService.getCategories(lang);
  }

  @Get(':id')
  getAlbum(@Param('id') categoryId, @Query('lang') lang): Promise<CategoryDTO> {
    return this.categoriesService.getCategory(categoryId, lang);
  }
}
