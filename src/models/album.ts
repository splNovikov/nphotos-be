import * as mongoose from 'mongoose';

import { ImageDTO } from './image';

const AlbumSchema = new mongoose.Schema({
  title_rus: { type: String, required: true },
  title_eng: { type: String, required: true },
  cover: { type: String, required: false },
});

interface Album extends mongoose.Document {
  id: string;
  title_rus: string;
  title_eng: string;
  cover?: string;
}

class AlbumDTO {
  constructor(
    public id: string,
    public title: string,
    public cover: string,
    public images?: ImageDTO[],
  ) {}
}

export { AlbumSchema, Album, AlbumDTO };
