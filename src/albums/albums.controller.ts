import { Controller, Get, Param, Query } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from '../models/album';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Get()
  getAlbums(@Query() query): Promise<Album[]> {
    return this.albumService.getAlbums(query.lang);
  }

  // todo: update everywhere @Param as it was here
  @Get(':id')
  getAlbum(@Param('id') albumId, @Query('lang') lang): Promise<Album> {
    return this.albumService.getAlbum(albumId, lang);
  }
}
