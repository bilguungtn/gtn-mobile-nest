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
    await client.profiles.create({
      data: {
        id: 1,
        name: 'test',
        name_kana: '吉本 太一',
        birthday: '20220901',
        contact_phone_number: '9898989',
        cell_phone_number: '123123123312',
        email: 'osamu46@example.com',
        sims: {
          create: {
            sim_number: '123123',
            happiness_id: '21312312',
          },
        },
      },
    });
    console.log('Success => profile seeder.');
    await client.users.create({ data: user });
    console.log('Success => User seeder.');
  } catch (error) {
    console.log('Error => User seeder : ', error);
  }
}

user_seeder();
