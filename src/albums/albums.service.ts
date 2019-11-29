import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ImagesService } from '../images/images.service';
import { FilesService } from '../files/files.service';
import { Album, AlbumDTO } from '../models/album';
import { ImageDTO } from '../models/image';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
    private readonly filesService: FilesService,
    private readonly imagesService: ImagesService,
  ) {}

  public async getAlbums(lang: langs = langs.eng): Promise<AlbumDTO[]> {
    const albums = await this.findAlbums();

    return albums.map(
      album =>
        new AlbumDTO(
          album.id,
          lang === langs.rus ? album.title_rus : album.title_eng,
          album.cover,
        ),
    );
  }

  public async getAlbum(albumId: string, lang: langs = langs.eng): Promise<AlbumDTO> {
    const album: Album = await this.findAlbum(albumId);
    const images: ImageDTO[] = await this.imagesService.getImages(albumId, lang);

    return new AlbumDTO(
      album.id,
      lang === langs.rus ? album.title_rus : album.title_eng,
      album.cover,
      images,
    );
  }

  // to increase performance - get album without optional properties, like "images"
  public async getSimpleAlbum(
    albumId: string,
    lang: langs = langs.eng,
  ): Promise<AlbumDTO> {
    const album: Album = await this.findAlbum(albumId);

    return new AlbumDTO(
      album.id,
      lang === langs.rus ? album.title_rus : album.title_eng,
      album.cover,
    );
  }

  // todo: also should be able to remove images
  public async updateAlbum(@Query() query, @Req() req, @Res() res): Promise<AlbumDTO> {
    let files;

    try {
      files = await this.filesService.imagesUpload(req, res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const { id: albumId } = query;
    const filesLocation = files.map(f => f.location);
    console.log(albumId);

    // 1. todo: add images to mongo
    // 2. todo: add images to album
    // todo: Image is an interface, we can not use "new"
    // const images = req.files.map(file => new Image())
    // todo: call method from album controller
    // this.addImages(query.albumId, images);

    // return new AlbumDTO();
  }

  private async findAlbums(): Promise<Album[]> {
    let albums: Album[];

    try {
      albums = await this.albumModel.find().exec();
    } catch (error) {
      throw new NotFoundException('Couldn\'t find albums');
    }

    if (!albums) {
      throw new NotFoundException('Couldn\'t find album');
    }

    return albums;
  }

  // created separate function 'findAlbum' - return Mongoose object Album
  // Mongoose object have methods like 'save', so we created this function for reuse
  private async findAlbum(id: string): Promise<Album> {
    let album: Album;

    try {
      album = await this.albumModel.findById(id);
    } catch (error) {
      throw new NotFoundException('Couldn\'t find album');
    }

    if (!album) {
      throw new NotFoundException('Couldn\'t find album');
    }

    return album;
  }
}
