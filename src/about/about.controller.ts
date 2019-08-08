import { Controller, Get, Query } from '@nestjs/common';
import { AboutService } from './about.service';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Get()
  getAbout(@Query() query): Promise<string> {
    return this.aboutService.getAbout(query.lang);
  }
}
