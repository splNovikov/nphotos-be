import * as mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  albumId: { type: String, required: true },
  title_rus: { type: String, required: true },
  title_eng: { type: String, required: true },
  path: { type: String, required: true },
  previewPath: { type: String, required: true },
});

interface Image extends mongoose.Document {
  id: string;
  title_rus: string;
  title_eng: string;
  path: string;
  previewPath: string;
}

class ImageDTO {
  constructor(
    public id: string,
    public title: string,
    public path: string,
    public previewPath: string,
  ) {}
}

export { ImageSchema, Image, ImageDTO };
