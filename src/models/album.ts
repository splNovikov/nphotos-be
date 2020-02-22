import * as mongoose from 'mongoose';

const AlbumSchema = new mongoose.Schema({
  titleRus: { type: String, required: true },
  titleEng: { type: String, required: true },
  createdDate: { type: String, required: true },
  cover: { type: String, required: false },
});

interface Album extends mongoose.Document {
  id: string;
  titleRus: string;
  titleEng: string;
  createdDate: string;
  cover?: string;
}

export { AlbumSchema, Album };
