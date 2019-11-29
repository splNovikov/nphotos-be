import { Controller, Get, Query } from '@nestjs/common';
import { AboutService } from './about.service';

import { AboutDTO } from '../models/aboutDTO';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  getAbout(@Query('lang') lang): Promise<AboutDTO[]> {
    return this.aboutService.getAbout(lang);
  }
}
