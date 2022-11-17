import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';

export class OldUserResponseDto {
  user_record_id: number;
  user_id: string;
  sim_number?: string;
  e_mail: string;
  user_name?: string;
  user_name_kana?: string;
  zip_code?: string;
  prefectures?: string;
  address_1?: string;
  address_2?: string;
  address_3?: string;
  address_4?: string;
  address_5?: string;
  phone?: string;
  mobile_phone?: string;
  billing_id?: string;
  service_id?: string;
  service_type?: number;
  plan?: string;
  plan_status?: number;
  singin_dt?: Date;
  cancel_dt?: Date;
  use_start_dt?: Date;
  use_end_dt?: Date;
  charge_start_dt?: Date;
//   bill_tbl?: any;
}
