import * as mongoose from 'mongoose';

const AlbumSchema = new mongoose.Schema({
  title_rus: { type: String, required: true },
  title_eng: { type: String, required: true },
  createdDate: { type: String, required: true },
  cover: { type: String, required: false },
});

interface Album extends mongoose.Document {
  id: string;
  // todo: optional: why underscore here in prop name?
  title_rus: string;
  title_eng: string;
  createdDate: string;
  cover?: string;
}

export { AlbumSchema, Album };
