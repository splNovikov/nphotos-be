import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AlbumsService } from './albums.service';
import { FilesService } from '../files/files.service';
import { Album, AlbumDTO } from '../models';
import { Roles } from '../decorators/roles.decorator';
import { langs } from '../constants/langs.enum';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumService: AlbumsService,
    private readonly filesService: FilesService,
  ) {}

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
  @UseInterceptors(FileInterceptor('cover'))
  async create(
    @Body() { album }: { album: string },
    @UploadedFile() file,
    @Res() res,
  ): Promise<Album> {
    // todo [after release]: why we call it in controller? Should be in service
    const uploadedCover = await this.filesService.coverUpload(file);

    return this.albumService.createAlbum(album, uploadedCover, res);
  }

  // todo [after release]: implement this:
  // @Post(':id')
  // @Roles('admin')
  // update(@Query() query, @Req() req, @Res() res): Promise<Album> {
  //   return this.albumService.updateAlbum(query, req, res);
  // }
}
