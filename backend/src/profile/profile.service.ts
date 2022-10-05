import { HttpException, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { PrismaService } from 'prisma/prisma.service';
import { UserResponseDto } from 'src/user/dto/responses/user.dto';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  public async getProfile(): Promise<any> {
    const profile = this.prismaService.profiles.findFirst({ where: { id: 2 } });
    return profile;
  }

  public async importUser(): Promise<string> {
    // const data = this.prismaService.users.findFirst({
    //   where: { id: +id },
    // });
    // return data;
    return '';
  }

  // users
  public async find(): Promise<UserResponseDto[]> {
    const data = this.prismaService.users.findMany();
    return data;
  }
  public async findByEmailAddress(email: string): Promise<UserResponseDto[]> {
    try {
      const data = this.prismaService.users.findMany({
        where: { email },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  //csv
  public async salesForceCustumorImporter(): Promise<any> {
    const csvFile = readFileSync('files/import_test.csv');
    // const csvFile = readFileSync('files/Untitled.csv');

    const csvData = csvFile.toString();
    const parsedCsv = await parse(csvData, {
      // header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });
    return parsedCsv;
  }

  public async createProfile(): Promise<any> {
    // const dummyProfile = {
    //   name: 'bilguun',
    //   name_kana: 'bilguun_kana',
    //   birthday: new Date('1999-01-26'),
    //   contact_phone_number: '0123456789',
    //   cell_phone_number: '123435',
    //   email: 'bilguun889@gmail.com',
    // };
    const profile = await this.prismaService.profiles.create({
      data: {
        name: 'bilguun',
        name_kana: 'bilguun_kana',
        birthday: new Date('1999-12-26'),
        contact_phone_number: '0123456789',
        cell_phone_number: '123435',
        email: 'test01@gmail.com',
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
            happiness_id: '21312312',
          },
        },
        visas: {
          create: {
            period_of_validity_date: new Date('2022-12-17'),
          },
        },
      },
    });
    if (!profile) throw new HttpException('already created', 500);

    const res: any = {
      statusCode: 201,
      message: 'Created user data.',
    };
    return res;
  }
}
