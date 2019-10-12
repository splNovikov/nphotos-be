import * as mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  price: { type: String, required: true },
});

interface Price extends mongoose.Document {
  // todo: update index to id
  index: number;
  price: string;
}

export { PriceSchema, Price };
