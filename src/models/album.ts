import * as mongoose from 'mongoose';

import { Image, ImageSchema } from './image';

const AlbumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cover: { type: String, required: false },
  images: { type: [ImageSchema], required: false },
});

interface Album {
  id: string;
  title: string;
  cover?: string;
  images?: Image[];
}

export { AlbumSchema, Album };
