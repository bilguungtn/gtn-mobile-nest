import { parse } from 'papaparse';
import { readFileSync } from 'fs';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { toProfileResponseDto } from 'src/common/helpers/dto-mapper.helper';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { UserResponseDto } from 'src/modules/user/dto/responses/user.dto';
import { ProfileDto } from 'src/modules/profile/dto/response/profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prismaService: PrismaService, // private profileService: ProfileService,
  ) {}

  public async getProfile(id: any): Promise<ProfileDto> {
    const profile = await this.prismaService.profiles.findFirst({
      where: { id: +id },
      include: {
        addresses: true,
        sims: true,
        visas: true,
      },
    });
    return toProfileResponseDto(profile);
  }

  public async updateProfile(
    data: ProfileDto,
    id: number,
  ): Promise<SuccessResponseDto> {
    try {
      const where = { id };
      const existing_profile = await this.prismaService.profiles.findUnique({
        where,
      });
      if (!existing_profile) {
        throw new NotFoundException();
      }
      const profile_updated = await this.prismaService.profiles.update({
        where,
        data: {
          name: data.name,
          name_kana: data.name_kana,
          birthday: data.birthdate,
          contact_phone_number: data.contact_phone_number,
          cell_phone_number: data.cell_phone_number,
          sims: {
            updateMany: {
              where: {
                profile_id: id,
              },
              data: {
                sim_number: data.contact_phone_number,
              },
            },
          },
          addresses: {
            updateMany: {
              where: {
                profile_id: id,
              },
              data: {
                postal_code: data.postal_code,
                address: data.address,
              },
            },
          },
          visas: {
            updateMany: {
              where: { profile_id: id },
              data: {
                classification_code: data.visa_classification_code,
                period_of_validity_date: data.visa_period_of_validity_date,
              },
            },
          },
        },
      });

      if (!profile_updated) throw new NotFoundException();
      const res: any = {
        statusCode: 201,
        message: 'Updated profile data.',
      };
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }

  public async getProfileWithSim(id: string, simNumber: string): Promise<any> {
    const profile = await this.prismaService.profiles.findFirst({
      where: { id: +id },
      include: {
        addresses: true,
        sims: true,
        visas: true,
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
    if (!profile)
      throw new HttpException(`bad request`, HttpStatus.BAD_REQUEST);

    const res: any = {
      statusCode: 201,
      message: 'Created user data.',
    };
    return res;
  }

  //csv
  public async salesForceCustumorImporter(): Promise<any> {
    const csvFile = readFileSync('files/import_test.csv');
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
