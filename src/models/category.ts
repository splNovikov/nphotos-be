import * as mongoose from 'mongoose';

import { AlbumDTO } from './albumDTO';

const CategorySchema = new mongoose.Schema({
  title_rus: { type: String, required: true },
  title_eng: { type: String, required: true },
  cover: { type: String, required: false },
});

interface Category extends mongoose.Document {
  id: string;
  title_rus: string;
  title_eng: string;
  cover?: string;
}

class CategoryDTO {
  constructor(
    public id: string,
    public title: string,
    public cover: string,
    public albums?: AlbumDTO[],
  ) {}
}

export { CategorySchema, Category, CategoryDTO };
