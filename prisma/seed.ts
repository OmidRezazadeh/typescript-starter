// prisma/seed.ts
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();

const NUM_USERS = 10;
const NUM_POSTS = 100;

async function main() {
  const { faker } = await import('@faker-js/faker');
  console.log('Start seeding...');

  // 1. Create Users and Profiles
  const createdUsers = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const user = await prisma.user.create({
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
  await prisma.post.createMany({
    data: postData,
  });
  console.log(`Created ${NUM_POSTS} posts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
