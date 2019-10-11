import * as mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  albumId: { type: String, required: true },
  title_eng: { type: String, required: true },
  title_rus: { type: String, required: true },
  path: { type: String, required: true },
  previewPath: { type: String, required: true },
});

class Image extends mongoose.Document {
  id: string;
  title: string;
  path: string;
  previewPath: string;
}

export { ImageSchema, Image };
