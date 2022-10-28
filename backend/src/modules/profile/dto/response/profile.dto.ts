import { ApiProperty } from '@nestjs/swagger';

export class ProfileDto {
  gtn_id?: number;

  @ApiProperty({ example: '山田 太郎' })
  name: string;

  @ApiProperty({ example: 'ヤマダ タロウ' })
  name_kana: string;

  @ApiProperty({ example: '2021-01-01' })
  birthdate: string;

  @ApiProperty({ example: '09000000000' })
  contact_phone_number: string;

  @ApiProperty({ example: '09000000000' })
  cell_phone_number: string;

  @ApiProperty({ example: '1111111' })
  postal_code: string;

  @ApiProperty({ example: '東京都豊島区1-1-1' })
  address: string;

  @ApiProperty({ example: 0 })
  visa_classification_code: number;

  @ApiProperty({ example: '2020-04-28' })
  visa_period_of_validity_date: string;
}
