import { Controller, Post, Query, Req, Res } from '@nestjs/common';
import { FilesService } from './files.service';

// todo: do we need controller?
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Query() query, @Req() request, @Res() response) {
    // Let it call imagesUpload every time, since we upload only images
    return this.filesService.imagesUpload(query, request, response);
  }
}
