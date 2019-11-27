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

import { FilesService } from '../files/files.service';
import { Album, AlbumDTO } from '../models/album';
import { Image, ImageDTO } from '../models/image';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel('Album') private readonly albumModel: Model<Album>,
    @InjectModel('Image') private readonly imageModel: Model<Image>,
    private readonly filesService: FilesService,
  ) {}

  // todo: return everywhere res.status(201)????
  // todo: check for exceptions
  async getAlbums(lang: langs = langs.eng): Promise<AlbumDTO[]> {
    const albums = await this.albumModel.find().exec();

    return albums.map(
      album =>
        new AlbumDTO(
          album.id,
          lang === langs.rus ? album.title_rus : album.title_eng,
          album.cover,
        ),
    );
  }

  async getAlbum(albumId: string, lang: langs = langs.eng): Promise<AlbumDTO> {
    const album: Album = await this.findAlbum(albumId);
    const images: Image[] = await this.findAlbumImages(albumId);

    return new AlbumDTO(
      album.id,
      lang === langs.rus ? album.title_rus : album.title_eng,
      album.cover,
      images.map(
        image =>
          new ImageDTO(
            image.id,
            lang === langs.rus ? image.title_rus : image.title_eng,
            image.path,
            image.previewPath,
          ),
      ),
    );
  }

  // get album without optional properties, like "images"
  async getSimpleAlbum(
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

  // todo: also should remove images
  async updateAlbum(@Query() query, @Req() req, @Res() res): Promise<AlbumDTO> {
    let files;

    try {
      files = await this.filesService.imagesUpload(req, res);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    const filesLocation = files.map(f => f.location);
    console.log(files.map(f => f.location));

    // 1. todo: add images to mongo
    // 2. todo: add images to album
    // todo: Image is an interface, we can not use "new"
    // const images = req.files.map(file => new Image())
    // todo: call method from album controller
    // this.addImages(query.albumId, images);

    // return new AlbumDTO();
  }

  // addImages = (albumId, images) => {
  //   // todo: if no albumId - throw exception
  // }

  // created separate function 'findAlbum' - return Mongoose object Album
  // Mongoose object has methods like 'save', so we created this function for reuse
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

  private async findAlbumImages(albumId: string): Promise<Image[]> {
    let images: Image[];

    try {
      images = await this.imageModel.find({ albumId });
    } catch (error) {
      throw new NotFoundException('Couldn\'t find images');
    }

    if (!images) {
      throw new NotFoundException('Couldn\'t find images');
    }

    return images;
  }
}
