import {
  BadRequestException,
  Get,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './validate/auth.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async create(data: { name: string; email: string; password: string }) {
    return await this.prisma.user.create({ data });
  }
  async list(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async all() {
    return this.prisma.user.findMany();
  }
  async login(loginDto: LoginDto) {
    const existsUser = await this.findByEmail(loginDto.email);
    if (!existsUser) {
      throw new BadRequestException('کاربری یافت نشد');
    }
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      existsUser.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: existsUser.id,
      email: existsUser.email,
    });
    return { message: 'Login successful', token };
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }
  async register(registerDto: RegisterDto) {
    const existsUser = this.findByEmail(registerDto.email);
    if (existsUser) {
      throw new BadRequestException(' ایمیل وارد شده تکراریست');
    }
    const password = await bcrypt.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: password,
        name: registerDto.name,
      },
    });
    return { user };
  }
}
