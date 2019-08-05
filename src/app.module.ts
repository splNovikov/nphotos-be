import { Module } from '@nestjs/common';

import { AlbumsModule } from './albums/albums.module';
import { ContactsModule } from './contacts/contacts.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, AlbumsModule, ContactsModule],
})
export class AppModule {}
