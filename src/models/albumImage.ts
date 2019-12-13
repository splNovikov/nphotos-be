import * as mongoose from 'mongoose';

const AlbumImageSchema = new mongoose.Schema({
  albumId: { type: String, required: true },
  imageId: { type: String, required: true },
});

interface AlbumImage extends mongoose.Document {
  id: string;
  albumId: string;
  imageId: string;
}

export { AlbumImageSchema, AlbumImage };
