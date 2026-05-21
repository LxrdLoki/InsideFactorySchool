// run this with npx tsx seed-test-users.ts (I added it to package.json so you can also use npm run createTestUsers)

import 'dotenv/config';

import bcrypt from 'bcrypt';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient, UserRole } from './prisma/generated/prisma/client';

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const users = [
    {
      username: 'testuser',
      email: 'test@test.com',
      password: 'TestPass123',
      role: UserRole.USER,
    },
    {
      username: 'testuser1',
      email: 'test1@test.com',
      password: 'TestPass123',
      role: UserRole.USER,
    },
    {
      username: 'testuser2',
      email: 'test2@test.com',
      password: 'TestPass123',
      role: UserRole.USER,
    },
    {
      username: 'adminuser',
      email: 'admin@test.com',
      password: 'AdminPass123',
      role: UserRole.ADMIN,
    },
  ];

  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      console.log(`User already exists: ${user.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.user.create({
      data: {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });

    console.log(`Created user: ${user.email}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
