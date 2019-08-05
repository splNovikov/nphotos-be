import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Module({
  imports: [],
  controllers: [ContactsController],
  providers: [AuthenticationService, ContactsService],
})
export class ContactsModule {}
