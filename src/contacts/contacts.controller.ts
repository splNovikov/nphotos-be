import { Controller, Get, Query } from '@nestjs/common';
import { ContactsService } from './contacts.service';

import { Contact } from '../models/contact';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  getContacts(@Query() query): Promise<Contact[]> {
    return this.contactsService.getContacts(query.lang);
  }
}
