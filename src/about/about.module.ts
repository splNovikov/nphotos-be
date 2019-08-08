import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { AuthenticationService } from '../authentication/authentication.service';

@Module({
  imports: [],
  controllers: [AboutController],
  providers: [AuthenticationService, AboutService],
})
export class AboutModule {}
