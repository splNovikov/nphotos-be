import { Controller, Get, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';

import { ContactDTO } from '../models/contactDTO';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  getContacts(@Query('lang') lang): Promise<ContactDTO[]> {
    return this.contactsService.getContacts(lang);
  }
}
