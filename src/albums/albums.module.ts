import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Module({
  imports: [],
  controllers: [AlbumsController],
  providers: [AuthenticationService, AlbumsService],
})
export class AlbumsModule {}
