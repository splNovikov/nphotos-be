import * as mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  titleRus: { type: String, required: false },
  titleEng: { type: String, required: false },
  uploadDate: { type: String, required: false },
  path: { type: String, required: true },
  previewPath: { type: String, required: false },
  awsKey: { type: String, required: true },
  previewAwsKey: { type: String, required: false },
});

interface Image extends mongoose.Document {
  id: string;
  titleRus?: string;
  titleEng?: string;
  // todo [after release]: why optional?
  uploadDate?: string;
  path: string;
  previewPath: string;
  awsKey: string;
  previewAwsKey: string;
}

export { ImageSchema, Image };
