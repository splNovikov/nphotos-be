import * as mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema({
  index: { type: Number, required: true },
  row: { type: String, required: true },
});

interface About {
  // todo: update index to id
  index: number;
  row: string;
}

export { AboutSchema, About };
