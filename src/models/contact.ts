import * as mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: { type: String, required: true },
  vkLink: { type: String, required: true },
  instagramLink: { type: String, required: true },
  facebookLink: { type: String, required: true },
  phone: { type: String, required: false },
  shortDescription: { type: String, required: false },
});

interface Contact extends mongoose.Document {
  id: string;
  name: string;
  avatar: string;
  vkLink: string;
  instagramLink: string;
  facebookLink: string;
  phone?: string;
  shortDescription?: string;
}

export { ContactSchema, Contact };
