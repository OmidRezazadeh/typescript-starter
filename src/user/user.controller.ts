import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
 
async login('login'){

}


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
  @Get('all')
  async all() {
    return this.userService.all();
  }

}
