import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const client = new PrismaClient();

async function seeder() {
  try {
    await client.profiles.create({
      data: {
        name: 'bilguun',
        name_kana: 'bilguun_kana',
        birthday: new Date('1999-12-26'),
        contact_phone_number: '0123456789',
        cell_phone_number: '123435',
        email: 'test1@gmail.com',
        addresses: {
          createMany: {
            data: [
              {
                postal_code: '1000001',
                address: 'address',
              },
              {
                postal_code: '1000002',
                address: 'address 2',
              },
            ],
          },
        },
        sims: {
          create: {
            sim_number: '123123',
            happiness_id: '213123121',
          },
        },
        visas: {
          create: {
            period_of_validity_date: new Date('2022-12-17'),
          },
        },
      },
    });
    console.log('Success => profile seeder.');

    await client.users.create({
      data: {
        name: 'ビルグウン',
        email: 'test1@gmail.com',
        password: await bcrypt.hash('Test1234', 10),
      },
    });
    console.log('Success => User seeder.');

  } catch (error) {
    console.log('Error => User seeder : ', error);
  }
}

seeder();
