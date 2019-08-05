import { Injectable } from '@nestjs/common';
import { Contact } from '../models/contact';
import { AuthenticationService } from '../authentication/authentication.service';
import { langs } from '../constants/langs.enum';

@Injectable()
export class ContactsService {
  constructor(private authenticationService: AuthenticationService) {}

  async getContacts(lang: langs): Promise<Contact[]> {
    const oAuth2Client = this.authenticationService.getOAuth2Client();

    return await getContacts(oAuth2Client, lang);
  }
}

async function getContacts(auth, lang = langs.eng): Promise<Contact[]> {
  return [{
    id: '1',
    name: 'Pavel',
    avatar: '',
  }];
}
