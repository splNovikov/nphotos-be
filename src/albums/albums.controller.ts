import { Body, Controller, Get, Param, Post, Query, Res } from '@nestjs/common';

import { AlbumsService } from './albums.service';
import { Album, AlbumDTO, CreateAlbumDTO } from '../models';
import { Roles } from '../decorators/roles.decorator';
import { langs } from '../constants/langs.enum';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Get()
  getAlbums(@Query('lang') lang: langs = langs.eng): Promise<AlbumDTO[]> {
    return this.albumService.getAlbumsDTO(lang);
  }

  @Get(':id')
  getAlbum(
    @Param('id') albumId,
    @Query('lang') lang: langs = langs.eng,
  ): Promise<AlbumDTO> {
    return this.albumService.getFullAlbumDTOById(albumId, lang);
  }

  @Post()
  @Roles('admin')
  create(@Body() album: CreateAlbumDTO, @Res() res): Promise<Album> {
    return this.albumService.createAlbum(album, res);
  }

  // todo [after release]: implement this:
  // @Post(':id')
  // @Roles('admin')
  // update(@Query() query, @Req() req, @Res() res): Promise<Album> {
  //   return this.albumService.updateAlbum(query, req, res);
  // }
}
