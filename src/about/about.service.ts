import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { About, AboutDTO } from '../models';
import { getTitleByLang } from '../utils/lang';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel('About') private readonly aboutModel: Model<About>,
  ) {}

  public async getAboutDTO(lang): Promise<AboutDTO[]> {
    const about = await this._getAbout();

    return about
      .sort((a, b) => (a.order > b.order ? 1 : b.order > a.order ? -1 : 0))
      .map(
        a =>
          ({
            index: a.id,
            row: getTitleByLang(a, lang, {
              rusPropName: 'row_rus',
              engPropName: 'row_eng',
            }),
          } as AboutDTO),
      );
  }

  private async _getAbout(): Promise<About[]> {
    let about: About[];

    try {
      about = await this.aboutModel.find().exec();
    } catch (error) {
      Logger.error(error);
      throw new NotFoundException(`Couldn't find "about"`);
    }

    if (!about) {
      throw new NotFoundException(`Couldn't find "about"`);
    }

    return about;
  }
}
