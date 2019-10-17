import * as mongoose from 'mongoose';

const AlbumCategorySchema = new mongoose.Schema({
  albumId: { type: String, required: true },
  categoryId: { type: String, required: true },
});

interface AlbumCategory extends mongoose.Document {
  id: string;
  albumId: string;
  categoryId: string;
}

export { AlbumCategorySchema, AlbumCategory };
