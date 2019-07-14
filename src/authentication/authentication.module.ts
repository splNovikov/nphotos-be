import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}
