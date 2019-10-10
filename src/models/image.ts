import * as mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
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
