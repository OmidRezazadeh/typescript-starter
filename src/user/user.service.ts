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
import { FiltersDto } from './validate/filters.schema';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const password = await bcrypt.hash(registerDto.password, 10);

    return this.prisma.$transaction(async (tx) => {
      const existsUser = await tx.user.findUnique({
        where: { email: registerDto.email },
      });

      if (existsUser) {
        throw new BadRequestException('ایمیل وارد شده تکراریست');
      }

      const user = await tx.user.create({
        data: {
          email: registerDto.email,
          password,
          name: registerDto.name,
        },
      });

      const profile = await tx.profile.create({
        data: {
          bio: 'sdfnsdfsdf',
          userId: user.id,
        },
      });

      return { user, profile };
    });
  }

  async edit(userId: number, name: string) {
    return await this.prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  async all(filters: FiltersDto) {
    const {
      userId,
      email,
      title,
      content,
      createdAt,
      page = 1,
      limit = 10,
    } = filters;

    const where: any = {};

    if (userId) {
      where.id = userId;
    }

    if (email) {
      where.email = {
        contains: email,
        mode: 'insensitive',
      };
    }

    const postConditions: any = {};

    if (title) {
      postConditions.title = {
        contains: title,
        mode: 'insensitive',
      };
    }

    if (content) {
      postConditions.content = {
        contains: content,
        mode: 'insensitive',
      };
    }

    if (createdAt) {
      postConditions.createdAt = {
        gte: createdAt,
      };
    }

    if (Object.keys(postConditions).length > 0) {
      where.posts = {
        some: postConditions,
      };
    }
    const skip = (page - 1) * limit;
    const take = limit;

    const total = await this.prisma.user.count({ where });

    const data = await this.prisma.user.findMany({
      where,
      skip,
      take,
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      data,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async create(data: { name: string; email: string; password: string }) {
    return await this.prisma.user.create({ data });
  }
  async list(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
      },
    });
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
}
