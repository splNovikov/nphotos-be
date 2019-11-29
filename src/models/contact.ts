import * as mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name_rus: { type: String, required: true },
  name_eng: { type: String, required: true },
  avatar: { type: String, required: true },
  vkLink: { type: String, required: true },
  instagramLink: { type: String, required: true },
  facebookLink: { type: String, required: true },
  phone: { type: String, required: false },
  shortDescription_rus: { type: String, required: false },
  shortDescription_eng: { type: String, required: false },
});

interface Contact extends mongoose.Document {
  id: string;
  name_rus: string;
  name_eng: string;
  avatar: string;
  vkLink: string;
  instagramLink: string;
  facebookLink: string;
  phone?: string;
  shortDescription_rus?: string;
  shortDescription_eng?: string;
}

export { ContactSchema, Contact };
