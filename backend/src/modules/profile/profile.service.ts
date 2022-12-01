import { parse } from 'papaparse';
import { readFileSync } from 'fs';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  toLoginInfoDto,
  toProfileResponseDto,
} from 'src/common/helpers/dto-mapper.helper';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { ProfileDto } from 'src/modules/profile/dto/response/profile.dto';
import {
  PasswordReqDto,
  ProfileReqDto,
} from 'src/modules/profile/dto/requests/profile.dto';
import { LoginInfoDto } from 'src/modules/profile/dto/login_info.dto';
import { SimsService } from '../sims/sims.service';

@Injectable()
export class ProfileService {
  constructor(
    private prismaService: PrismaService,
    private readonly simService: SimsService,
  ) {}

  public async getProfile(gtn_id: number): Promise<any> {
    const profile = await this.prismaService.profiles.findFirst({
      where: { id: +gtn_id },
      include: {
        addresses: {
          select: {
            address: true,
            postal_code: true,
          },
        },
        visas: true,
      },
    });
    return profile;
  }

  public async getProfileWithSim(gtn_id: number, phoneNumber: string) {
    try {
      const _profile = await this.getProfile(gtn_id);
      const sim = await this.simService.findBySimNumberAndProfileId(
        gtn_id,
        phoneNumber,
      );
      const profile = { ..._profile, sim };
      return profile;
    } catch (error) {
      throw error;
    }
  }

  public async loginInfo(gtn_id: number): Promise<LoginInfoDto> {
    const login_info = await this.prismaService.profiles.findUnique({
      where: { id: +gtn_id },
      select: { email: true },
    });

    return toLoginInfoDto(login_info);
  }

  public async changeEmail(
    id: number,
    email: string,
  ): Promise<SuccessResponseDto> {
    try {
      const duplicated = await this.prismaService.profiles.findFirst({
        where: { email },
      });
      if (duplicated)
        throw new HttpException('EMAIL_ALREADY_USED', HttpStatus.FOUND);
      //send email
      await this.prismaService.profiles.update({
        where: { id },
        data: {
          email,
        },
      });
      const res: any = {
        statusCode: 200,
        message: 'EMAIL_UPDATED',
      };
      return res;
    } catch (error) {
      throw error;
    }
  }

  public async newPassword(id: number, data: PasswordReqDto) {
    return 'password change';
  }

  public async updateProfile(
    data: ProfileReqDto,
    gtn_id: number,
  ): Promise<SuccessResponseDto> {
    try {
      const existing_profile = await this.getProfile(gtn_id);
      if (!existing_profile) {
        throw new NotFoundException();
      }
      const profile_updated = await this.prismaService.profiles.update({
        where: { id: +gtn_id },
        data: {
          name: data.name,
          name_kana: data.name_kana,
          birthday: new Date(data.birthdate),
          contact_phone_number: data.contact_phone_number,
          cell_phone_number: data.cell_phone_number,
          sims: {
            updateMany: {
              where: {
                profile_id: gtn_id,
              },
              data: {
                sim_number: data.contact_phone_number,
              },
            },
          },
          addresses: {
            updateMany: {
              where: {
                profile_id: gtn_id,
              },
              data: {
                postal_code: data.postal_code,
                address: data.address,
              },
            },
          },
          visas: {
            updateMany: {
              where: { profile_id: gtn_id },
              data: {
                classification_code: data.visa_classification_code,
                period_of_validity_date: new Date(
                  data.visa_period_of_validity_date,
                ),
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

  // profile find
  public async findByEmailAddress(email: string): Promise<ProfileDto> {
    try {
      const data = await this.prismaService.profiles.findFirst({
        where: { email },
        include: {
          sims: true,
          addresses: true,
          visas: true,
        },
      });
      return toProfileResponseDto(data);
    } catch (error) {
      console.log(error);
    }
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
