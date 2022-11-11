import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { UnauthorizedUserException } from 'src/common/exceptions/unauthorized.exception';
import { comparePasswords } from 'src/common/helpers/compare-password.helper';
import { UserResponseDto } from 'src/modules/user/dto/responses/user.dto';
import { CreateUserRequestDto, LoginRequestDto } from './dto/requests/user.dto';
import { UserAlreadyExistsException } from './exceptions/already-exists.exception';
import * as bcrypt from 'bcrypt';
import { CommonException } from 'src/common/exceptions/common.exception';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';
import { readFileSync } from 'fs';
import { parse } from 'papaparse';

@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /**
   * getUser.
   * @param {string} param0 email address @param {string} param1 password ==> {LoginRequestDto}
   * @returns
   */
  async getUser(id: any): Promise<any> {
    const data = this.prismaService.users.findFirst({
      where: { id: +id },
    });
    return data;
  }

  /**
   * Login.
   * @param {string} param0 email address @param {string} param1 password ==> {LoginRequestDto}
   * @returns
   */
  async login({ email, password }: LoginRequestDto): Promise<UserResponseDto> {
    const user = await this.prismaService.users.findFirst({
      where: { email },
    });
    if (!user) {
      throw new UnauthorizedUserException();
    }
    // compare password
    const areEqual = await comparePasswords(user.password, password);
    if (!areEqual) {
      throw new UnauthorizedUserException();
    }
    const _user: UserResponseDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
    };
    return _user;
  }

  /**
   * Register.
   * @param {string} param0 email address @param {string} param1 password ==> {LoginRequestDto}
   * @returns
   */
  async register(
    createUserRequestDto: CreateUserRequestDto,
  ): Promise<SuccessResponseDto> {
    try {
      const inDB = await this.prismaService.users.findFirst({
        where: { email: createUserRequestDto.email },
      });
      if (inDB) {
        throw new UserAlreadyExistsException();
      }
      const pass = await bcrypt.hash(createUserRequestDto.password, 10);

      await this.prismaService.users.create({
        data: {
          name: createUserRequestDto.name,
          email: createUserRequestDto.email,
          password: pass,
        },
      });
      const res: any = {
        statusCode: 201,
        message: 'Created user data.',
      };
      return res;
    } catch (error) {
      throw new CommonException(error);
    }
  }

  // users
  async find(): Promise<UserResponseDto[]> {
    const data = this.prismaService.users.findMany();
    return data;
  }
  async findByEmailAddress(email: string): Promise<UserResponseDto[]> {
    try {
      const data = this.prismaService.users.findMany({
        where: { email },
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  // daily user import
  async userImport() {
    const csvFile = readFileSync('files/dummy_user.csv');
    const csvData = csvFile.toString();
    const csvParse = parse(csvData, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });
    const { data } = csvParse;
    // const arr: any = data[0];
    // const item = arr.filter((e) => e != '');
    // for (const item of data) {
    //   // is company account skip
    //   // if canceled at skip
    //   // TODO: SalesforceCustomerImportCommandBuilder.php ene file  dotor bga
    // const name = item[6];
    // const nameKana = item[17];
    // const birthday = item[7];
    // const contactPhoneNumber = item[2];
    // const email = item[28];
    // console.log(name, nameKana, birthday, contactPhoneNumber, email);
    // }
    // await this.prismaService.old_user_tbl.createMany({
    //   data: [
    //     {
    //       user_record_id: +'1',
    //       user_id: '121',
    //       sim_number: 'asdf',
    //       e_mail: 'bilguun@gmakiflads.com',
    //     },
    //     {
    //       user_record_id: +'2',
    //       user_id: '21312412',
    //       sim_number: 'afsdfa',
    //       e_mail: 'test@gmail.com',
    //     },
    //   ],
    // });
    return csvParse.data;
  }
}

// export const parseCsv = (items) => {
//   items.map((data) => {
//     return {
//       user_record_id: +data.user_record_id,
//       user_id: data.user_id,
//       sim_number: data.sim_number,
//       e_mail: data.e_mail,
//       user_name: data.user_name,
//       user_name_kana: data.user_name_kana,
//       zip_code: data.zip_code,
//       prefectures: data.prefectures,
//       address_1: data.address_1,
//       address_2: data.address_2,
//       address_3: data.address_3,
//       address_4: data.address_4,
//       address_5: data.address_5,
//       phone: data.phone,
//       mobile_phone: data.mobile_phone,
//       billing_id: data.billing_id,
//       service_id: data.service_id,
//       service_type: +data.service_type,
//       plan: data.plan,
//       plan_status: +data.plan_status,
//       signin_dt: data.signin_dt,
//       cancel_dt: data.cancel_dt,
//       use_start_dt: data.use_start_dt,
//       use_end_dt: data.use_end_dt,
//       charge_start_dt: data.charge_start_dt,
//       charge_end_dt: data.charge_end_dt,
//     };
//   });
// };
