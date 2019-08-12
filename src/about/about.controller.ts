import { Controller, Get, Query } from '@nestjs/common';
import { AboutService } from './about.service';

import { About } from '../models/about';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  getAbout(@Query() query): Promise<About[]> {
    return this.aboutService.getAbout(query.lang);
  }
}
