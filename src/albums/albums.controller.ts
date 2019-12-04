import { Controller, Get, Param, Post, Query, Req, Res } from '@nestjs/common';

import { AlbumsService } from './albums.service';
import { AlbumDTO } from '../models';
import { Roles } from '../decorators/roles.decorator';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

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
  // todo: any?
  update(@Query() query, @Req() req, @Res() res): Promise<any> {
    return this.albumService.updateAlbum(query, req, res);
  }
}
