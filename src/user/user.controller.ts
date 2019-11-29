import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

import { UserDTO } from '../models';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(): Promise<UserDTO> {
    return this.userService.getUserForClient();
  }
}
