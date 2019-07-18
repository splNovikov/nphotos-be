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

  @Get(':id')
  getAlbum(@Param() params, @Query() query): Promise<Album> {
    return this.albumService.getAlbum(params.id, query.lang);
  }
}
