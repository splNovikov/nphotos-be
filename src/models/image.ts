import * as mongoose from 'mongoose';

const ImageSchema = new mongoose.Schema({
  title_rus: { type: String, required: false },
  title_eng: { type: String, required: false },
  uploadDate: { type: String, required: false },
  path: { type: String, required: true },
  previewPath: { type: String, required: false },
  awsKey: { type: String, required: true },
  previewAwsKey: { type: String, required: false },
});

interface Image extends mongoose.Document {
  id: string;
  title_rus?: string;
  title_eng?: string;
  // todo [after release]: why optional?
  uploadDate?: string;
  path: string;
  previewPath: string;
  awsKey: string;
  previewAwsKey: string;
}

export { ImageSchema, Image };
