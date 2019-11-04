import { Controller, Post, Req, Res } from '@nestjs/common';
import { FilesService } from './files.service';

// todo: do we need controller?
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  create(@Req() request, @Res() response) {
    // todo pass type to detect service function
    return this.filesService.imagesUpload(request, response);
  }
}
