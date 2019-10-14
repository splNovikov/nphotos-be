import * as mongoose from 'mongoose';

const PriceSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  price_rus: { type: String, required: false },
  price_eng: { type: String, required: false },
});

interface Price extends mongoose.Document {
  id: string;
  order: number;
  price_rus: string;
  price_eng: string;
}

class PriceDTO {
  constructor(
    public index: string,
    public price: string,
  ) {}
}

export { PriceSchema, Price, PriceDTO };
