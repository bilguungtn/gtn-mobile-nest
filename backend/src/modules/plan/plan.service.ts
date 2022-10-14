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
export class PlanService {
  constructor(
    private prismaService: PrismaService, // private profileService: ProfileService,
  ) {}

  public async getAvailablePlan(id: any): Promise<any> {
    // const planGroups = await this.prismaService.plans.findMany({
    //   where: {
    //     plan_groups: {
    //       id: +id,
    //     },
    //   },
    // });
    // console.log(planGroups, 'available_plan_group');
  }

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
}
