import { Module } from '@nestjs/common';

import { AlbumsModule } from './albums/albums.module';
import { ContactsModule } from './contacts/contacts.module';
import { AboutModule } from './about/about.module';
import { PriceListModule } from './priceList/priceList.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, AlbumsModule, ContactsModule, AboutModule, PriceListModule],
})
export class AppModule {}
