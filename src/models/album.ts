import * as mongoose from 'mongoose';

import { Image } from './image';

const AlbumSchema = new mongoose.Schema({
  title_rus: { type: String, required: true },
  title_eng: { type: String, required: true },
  cover: { type: String, required: false },
});

interface Album extends mongoose.Document {
  id: string;
  title: string;
  cover?: string;
  images?: Image[];
}

export { AlbumSchema, Album };
