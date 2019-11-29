import * as mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  row_rus: { type: String, required: false },
  row_eng: { type: String, required: false },
});

interface About extends mongoose.Document {
  id: string;
  order: number;
  row_rus: string;
  row_eng: string;
}

export { AboutSchema, About };
