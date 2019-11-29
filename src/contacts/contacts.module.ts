import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { ContactSchema } from '../models';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Contact', schema: ContactSchema }]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
})
export class ContactsModule {}
