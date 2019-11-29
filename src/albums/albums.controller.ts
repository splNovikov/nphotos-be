import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';

import { AlbumsService } from './albums.service';
import { AlbumDTO } from '../models/albumDTO';
import { Roles } from '../decorators/roles.decorator';
import { FilesService } from '../files/files.service';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumService: AlbumsService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  getAlbums(@Query('lang') lang): Promise<AlbumDTO[]> {
    return this.albumService.getAlbums(lang);
  }

  @Get(':id')
  getAlbum(@Param('id') albumId, @Query('lang') lang): Promise<AlbumDTO> {
    return this.albumService.getAlbum(albumId, lang);
  }

  @Post()
  @Roles('admin')
  async update(@Query() query, @Req() request, @Res() response) {
    return this.albumService.updateAlbum(query, request, response);
  }
}
