import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Contact, ContactDTO } from '../models';
import { getTitleByLang } from '../utils/lang';

@Injectable()
export class ContactsService {
  constructor(
    @InjectModel('Contact') private readonly contactModel: Model<Contact>,
  ) {}

  public async getContactsDTO(lang): Promise<ContactDTO[]> {
    const contacts = await this._getContacts();

    return contacts.map(
      contact =>
        ({
          id: contact.id,
          name: getTitleByLang(contact, lang, {
            rusPropName: 'name_rus',
            engPropName: 'name_eng',
          }),
          avatar: contact.avatar,
          vkLink: contact.vkLink,
          instagramLink: contact.instagramLink,
          facebookLink: contact.facebookLink,
          phone: contact.phone,
          shortDescription: getTitleByLang(contact, lang, {
            rusPropName: 'shortDescription_rus',
            engPropName: 'shortDescription_eng',
          }),
        } as ContactDTO),
    );
  }

  private async _getContacts(): Promise<Contact[]> {
    let contacts: Contact[];

    try {
      contacts = await this.contactModel.find().exec();
    } catch (error) {
      throw new NotFoundException("Couldn't find contacts");
    }

    if (!contacts) {
      throw new NotFoundException("Couldn't find contacts");
    }

    return contacts;
  }
}
