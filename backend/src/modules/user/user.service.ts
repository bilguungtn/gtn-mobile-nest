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
    const csvFile = readFileSync('files/import_test.csv');
    const csvData = csvFile.toString();
    const csvParse = parse(csvData, {
      // header: true,
      skipEmptyLines: true,
      // beforeFirstChunk: function (chunk) {
      //   const rows = chunk.split(/\r\n|\r|\n/);
      //   rows[0] =
      //     'item_name, capacity_gb, name, plan_group_id, capacity_mb, price, time_display, happiness_id, happiness_name, charge_plan, carrier_type, deadline_time';
      //   return rows.join('\r\n');
      // },
      transformHeader: (header) => header.toLowerCase().replace('#', '').trim(),
      complete: (results) => results.data,
    });
    const { data } = csvParse;
    // const arr: any = data[0];
    // const item = arr.filter((e) => e != '');
    for (const item of data) {
      // const item = items.filter((e: any) => e !== '');
      // const item = items;
      // is company account skip
      // if canceled at skip
      // TODO: SalesforceCustomerImportCommandBuilder.php ene file  dotor bga
    const name = item[6];
    const nameKana = item[17];
    const birthday = item[7];
    const contactPhoneNumber = item[2];
    const email = item[28];
    console.log(name, nameKana, birthday, contactPhoneNumber, email);
    }
    return csvParse.data;
  }
}
