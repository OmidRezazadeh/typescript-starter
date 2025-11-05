import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
 @Post('store')
  async create(
    @Body() data: { name: string; email: string; password: string },
  ) {
    return await this.userService.create(data);
  }
}
