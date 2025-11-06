import { BadRequestException, Get, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './validate/auth.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
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
  async register(registerDto:RegisterDto){
    const existsUser = await this.prisma.user.findUnique(
      {
        where:{email:registerDto.email}
      });
      if (existsUser) {
        throw new BadRequestException(' ایمیل وارد شده تکراریست')
      }
      const password = await bcrypt.hash(registerDto.password,10)
      const user = await this.prisma.user.create({
        data: {
          email: registerDto.email,
          password: password,
          name: registerDto.name
        }
      }) 
          return {user};
  }
  
}
