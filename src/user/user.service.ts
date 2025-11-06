import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
