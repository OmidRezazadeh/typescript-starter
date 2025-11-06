import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}
        create(data: { title: string; content: string; }, userId: number) {
            return this.prisma.post.create({
                data: {
                    title: data.title,
                    content: data.content,
                    authorId: userId
                }
            });
          }
}
