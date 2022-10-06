import { HttpException, Injectable } from '@nestjs/common';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';
import { PrismaService } from 'prisma/prisma.service';
import { UserResponseDto } from 'src/user/dto/responses/user.dto';

@Injectable()
export class ProfileService {
  constructor(private prismaService: PrismaService) {}

  public async getProfile(id: any): Promise<any> {
    const profile = await this.prismaService.profiles.findFirst({
      where: { id: +id },
      include: {
        addresses: true,
        sims: true,
      },
    });
    return profile;
  }

  public async updateProfile(data: any): Promise<any> {
    return '';
  }

  public async getProfileWithSim(id: any, simNumber): Promise<any> {
    const profile = await this.prismaService.profiles.findFirst({
      where: { id: +id },
      include: {
        addresses: true,
        sims: true,
      },
    });
    return profile;
  }

  public async importUser(): Promise<string> {
    return '';
  }

  // profile find
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

  public async createProfile(data: any): Promise<any> {
    const profile = await this.prismaService.profiles.create({
      data,
    });
    if (!profile) throw new HttpException('already created', 500);

    const res: any = {
      statusCode: 201,
      message: 'Created user data.',
    };
    return res;
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
}
