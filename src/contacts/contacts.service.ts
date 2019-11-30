import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contact, ContactDTO } from '../models';
import { langs } from '../constants/langs.enum';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel('Contact') private readonly contactModel: Model<Contact>,
  ) {}

  public async getContacts(lang: langs = langs.eng): Promise<ContactDTO[]> {
    const contacts = await this._getContacts();

    return contacts.map(
      contact => ({
        id: contact.id,
        name: lang === langs.rus ? contact.name_rus : contact.name_eng,
        avatar: contact.avatar,
        vkLink: contact.vkLink,
        instagramLink: contact.instagramLink,
        facebookLink: contact.facebookLink,
        phone: contact.phone,
        shortDescription: lang === langs.rus
          ? contact.shortDescription_rus
          : contact.shortDescription_eng,
      }) as ContactDTO,
    );
  }

  private async _getContacts(): Promise<Contact[]> {
    let contacts: Contact[];

    try {
      contacts = await this.contactModel.find().exec();
    } catch (error) {
      throw new NotFoundException('Couldn\'t find contacts');
    }

    if (!contacts) {
      throw new NotFoundException('Couldn\'t find contacts');
    }

    return contacts;
  }
}
