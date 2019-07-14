import { Module } from '@nestjs/common';

import { AlbumsModule } from './albums/albums.module';
import { AuthenticationModule } from './authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, AlbumsModule],
})
export class AppModule {}
