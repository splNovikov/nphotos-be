import { Controller, Post, Query, Req, Res, UseGuards } from '@nestjs/common';

import { FilesService } from './files.service';
import { RolesGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';

// todo: do we need controller? - remove it after testing
@Controller('files')
@UseGuards(RolesGuard)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Roles('admin')
  async imagesUpload(@Query() query, @Req() request, @Res() response) {
    return this.filesService.imagesUpload(query, request, response);
  }
}
