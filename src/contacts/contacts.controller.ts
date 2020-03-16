import { Controller, Get, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';

import { ContactDTO } from '../models';
import { langs } from '../constants/langs.enum';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  getContacts(@Query('lang') lang: langs): Promise<ContactDTO[]> {
    return this.contactsService.getContactsDTO(lang);
  }
}
