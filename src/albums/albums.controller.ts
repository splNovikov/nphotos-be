import { Controller, Get, Param } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { Album } from '../models/album';

@Controller('albums')
export class AlbumsController {
  constructor(private readonly albumService: AlbumsService) {}

  @Get()
  getAlbums(): Promise<Album[]> {
    return this.albumService.getAlbums();
  }

  @Get(':id')
  getAlbum(@Param() params): Promise<Album> {
    return this.albumService.getAlbum(params.id);
  }
}
