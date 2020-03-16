import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AlbumsService } from './albums.service';
import { FilesService } from '../files/files.service';
import { AlbumDTO, CreateAlbumDTO } from '../models';
import { Roles } from '../decorators/roles.decorator';
import { langs } from '../constants/langs.enum';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumService: AlbumsService,
    private readonly filesService: FilesService,
  ) {}

  @Get()
  getAlbums(@Query('lang') lang: langs): Promise<AlbumDTO[]> {
    return this.albumService.getAlbumsDTO(lang);
  }

  @Get(':id')
  getAlbum(
    @Param('id') albumId,
    @Query('lang') lang: langs,
  ): Promise<AlbumDTO> {
    return this.albumService.getFullAlbumDTOById(albumId, lang);
  }

  @Post()
  @Roles('admin')
  @UseInterceptors(FileInterceptor('cover'))
  async create(
    @Body() album: CreateAlbumDTO,
    @UploadedFile() cover,
  ): Promise<AlbumDTO> {
    if (cover) {
      // Add Cover to Storage
      const uploadedCover = await this.filesService.coverUpload(cover);

      album = {
        ...album,
        cover: uploadedCover.path,
      };
    }

    return this.albumService.createAlbum(album, album.categoryId);
  }

  @Put(':id')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('cover'))
  async updateAlbum(
    @Param('id') albumId: string,
    @UploadedFile() cover,
    @Body() album: AlbumDTO,
  ): Promise<AlbumDTO> {
    if (cover) {
      // Add Cover to Storage
      const uploadedCover = await this.filesService.coverUpload(cover);

      album = {
        ...album,
        cover: uploadedCover.path,
      };
    }

    return this.albumService.updateAlbum(albumId, album);
  }
}
