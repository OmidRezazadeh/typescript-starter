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
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pip';
import type { RegisterDto ,LoginDto } from './validate/auth.schema';
import { loginSchema, registerSchema } from './validate/auth.schema';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(loginSchema)) loginDto:LoginDto) {
           return this.userService.login(loginDto)
  }
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return this.userService.register(registerDto);
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
