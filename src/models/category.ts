import * as mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  titleRus: { type: String, required: true },
  titleEng: { type: String, required: true },
  cover: { type: String, required: false },
});

interface Category extends mongoose.Document {
  id: string;
  titleRus: string;
  titleEng: string;
  cover?: string;
}

export { CategorySchema, Category };
