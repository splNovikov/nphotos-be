import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contact, ContactDTO } from '../models/contact';
import { langs } from '../constants/langs.enum';

@Injectable()
export class ContactsService {

  constructor(
    @InjectModel('Contact') private readonly contactModel: Model<Contact>) {
  }

  async getContacts(lang: langs = langs.eng): Promise<ContactDTO[]> {
    const contacts = await this.contactModel.find().exec();

    return contacts.map(contact => new ContactDTO(
      contact.id,
      lang === langs.rus ? contact.name_rus : contact.name_eng,
      contact.avatar,
      contact.vkLink,
      contact.instagramLink,
      contact.facebookLink,
      contact.phone,
      lang === langs.rus
        ? contact.shortDescription_rus
        : contact.shortDescription_eng,
    ));
  }
}
