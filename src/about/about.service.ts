import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { About, AboutDTO } from '../models/about';
import { langs } from '../constants/langs.enum';

@Injectable()
export class AboutService {
  constructor(
    @InjectModel('About') private readonly aboutModel: Model<About>) {
  }

  async getAbout(lang: langs): Promise<AboutDTO[]> {
    const about = await this.aboutModel.find().exec();

    return about
      .sort((a, b) => a - b)
      .map(a => new AboutDTO(
      about.id,
      lang === langs.rus ? a.row_rus : a.row_eng,
    ));
  }
}
