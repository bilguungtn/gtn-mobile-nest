import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const client = new PrismaClient();

async function user_seeder() {
  const user = {
    name: '吉本 太一',
    email: 'osamu46@example.com',
    password: await bcrypt.hash('GTn123!@', 10),
    remember_token: 'whBCL5fE0h',
  };
  try {
    await client.users.create({ data: user });
    console.log('Success => User seeder.');
  } catch (error) {
    console.log('Error => User seeder : ', error);
  }
}

user_seeder();
