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
import { ImagesService } from '../images/images.service';
import { Album, AlbumDTO } from '../models';
import { Roles } from '../decorators/roles.decorator';
import { langs } from '../constants/langs.enum';

@Controller('albums')
export class AlbumsController {
  constructor(
    private readonly albumService: AlbumsService,
    private readonly filesService: FilesService,
    private readonly imagesService: ImagesService,
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
    // 1. Add cover to Storage
    const cover = await this.filesService.coverUpload(file);

    // 2. Add cover to image database
    // todo: why do we need add cover to images table - I dont add it in categories controller
    const insertedCover = await this.imagesService.addSingleImage(cover);

    // 3. Add to DB
    // todo: major: check that insertedCover is correct?
    //  I think it should be cover?
    return this.albumService.createAlbum(album, insertedCover, res);
  }

  // todo [after release]: implement this:
  // @Post(':id')
  // @Roles('admin')
  // update(@Query() query, @Req() req, @Res() res): Promise<Album> {
  //   return this.albumService.updateAlbum(query, req, res);
  // }
}
