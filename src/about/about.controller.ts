import { Controller, Get, Query } from '@nestjs/common';
import { AboutService } from './about.service';

import { AboutDTO } from '../models';
import { langs } from '../constants/langs.enum';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  getAbout(@Query('lang') lang: langs): Promise<AboutDTO[]> {
    return this.aboutService.getAboutDTO(lang);
  }
}
