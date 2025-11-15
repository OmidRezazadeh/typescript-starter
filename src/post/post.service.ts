import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}
 async query(){

  const user = await this.prisma.user.findFirst({
    where: {
      posts: {
        some: {
          deletedAt: null,   // پستی که حذف نشده
        },
      },
    },
    include: {
      posts: true,
    },
    orderBy: {
      id: "desc",
    },
  });
return user; 
}
async  create() {

    
const NUM_USERS = 10;
const NUM_POSTS = 100;

    const { faker } = await import('@faker-js/faker');
    console.log('Start seeding...');
  
    // 1. Create Users and Profiles
    const createdUsers = [];
    for (let i = 0; i < NUM_USERS; i++) {
      const user = await this.prisma.user.create({
        data: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: faker.internet.password(), // In a real app, hash this password
          profile: {
            create: {
              bio: faker.lorem.sentence(),
              role: 1
            },
          },
        },
      });
      createdUsers.push(user);
    }
    console.log(`Created ${NUM_USERS} users and profiles.`);
  
    // 2. Create Posts
    const postData = [];
    for (let i = 0; i < NUM_POSTS; i++) {
      // Randomly assign a post to one of the created users
      const randomUser = faker.helpers.arrayElement(createdUsers);
  
      postData.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(2),
        authorId: randomUser.id,
      });
    }
  
    // Use createMany to efficiently insert all posts at once
    await this.prisma.post.createMany({
      data: postData,
    });
    console.log(`Created ${NUM_POSTS} posts.`);

  }

  async list() {
    return this.prisma.post.findMany();
  }

  async softDelete(postId: number) {
    // return  await this.prisma.post.update({
    //   where: { id: postId },
    //   data: { deletedAt: new Date() },
    // });
  return await this.prisma.post.update({
    where:{id:postId},
    data:{deletedAt:new Date()}
  })
  }

  async restore(postId: number) {
    return this.prisma.post.update({
      where: { id: postId },
      data: { deletedAt: null },
    });
  }
}
