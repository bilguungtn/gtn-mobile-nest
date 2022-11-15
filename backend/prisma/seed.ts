import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClient2 } from '@prisma/client-2';

const client = new PrismaClient();
const client2 = new PrismaClient2();

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

    await client2.user_tbl.create({
      data: {
        user_id: '123214',
        user_name: 'ビルグウン',
        e_mail: 'test1@gmail.com',
      },
    });
    console.log('Success => User seeder.');
  } catch (error) {
    console.log('Error => User seeder : ', error);
  }
}

seeder();
