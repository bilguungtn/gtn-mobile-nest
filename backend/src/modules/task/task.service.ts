import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaServiceOld } from 'prisma/prisma.service';
import { dateFormat } from 'src/common/helpers/date.helper';
import { SuccessResponseDto } from 'src/common/responses/success-response.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prismaServiceOld: PrismaServiceOld) {}

  /**
   * daily user import create table
   * @returns {SuccessResponseDto}
   */
  @Cron(CronExpression.EVERY_DAY_AT_5AM, {
    name: 'create_user_tbl',
  })
  async createUserTableDaily(): Promise<SuccessResponseDto> {
    const date = new Date();
    const tableName = `user_tbl_${dateFormat(date)}`;

    console.log('===>', tableName);

    // TODO: remove old tables
    await this.prismaServiceOld.$queryRawUnsafe(
      `CREATE TABLE ${tableName}( user_record_id int UNSIGNED NOT NULL PRIMARY KEY,
      user_id varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE KEY,
      sim_number varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      e_mail varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
      user_name varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      user_name_kana varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      zip_code char(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      prefectures varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      address_1 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      address_2 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      address_3 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      address_4 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      address_5 varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      phone varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      mobile_phone varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      billing_id varchar(12) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      service_id varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      service_type int DEFAULT NULL,
      plan varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
      plan_status int UNSIGNED DEFAULT NULL,
      signin_dt date DEFAULT NULL,
      cancel_dt date DEFAULT NULL,
      use_start_dt date DEFAULT NULL,
      use_end_dt date DEFAULT NULL,
      charge_start_dt date DEFAULT NULL,
      charge_end_dt date DEFAULT NULL)`,
    );
    const res: any = {
      statusCode: 200,
      message: 'created table',
    };
    return res;
  }
}
