import { Controller, Get, Query } from '@nestjs/common';
import { CategoriesService } from './categories.service';

import { CategoryDTO } from '../models/category';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getContacts(@Query('lang') lang): Promise<CategoryDTO[]> {
    return this.categoriesService.getCategories(lang);
  }
}
