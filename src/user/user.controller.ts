import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
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
@Get('list/:userId')
async list(@Param('userId', ParseIntPipe) userId: number) {
  return this.userService.list(userId);
}
}
