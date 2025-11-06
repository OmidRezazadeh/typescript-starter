import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ZodValidationPipe } from 'src/common/pipes/zod-validation.pip';
import type { RegisterDto, LoginDto } from './validate/auth.schema';
import { loginSchema, registerSchema } from './validate/auth.schema';
import { FilterSchema } from './validate/filters.schema';
import type { FiltersDto } from './validate/filters.schema';
import { JwtAuthGuard } from 'src/auth/strategies/jwt-auth.guard';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Put('edit')
  async create(@Body() data:{name:string},
   @Req() req) {
    const userId: number = req.user.id;
    return await this.userService.edit(userId, data.name);
  }

  @Get('all')
  async all(@Query(new ZodValidationPipe(FilterSchema)) filterDto: FiltersDto) {
    return this.userService.all(filterDto);
  }
  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }
  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) registerDto: RegisterDto,
  ) {
    return this.userService.register(registerDto);
  }

  @Get('list/:userId')
  async list(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.list(userId);
  }
}
