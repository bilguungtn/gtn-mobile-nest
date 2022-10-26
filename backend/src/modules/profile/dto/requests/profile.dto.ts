import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ImportUserCommand {
  id: number;
  name: string;
  nameKana: string;
  birthday: string;
  contactPhoneNumber: string;
}

export class ProfileReqDto {
  @ApiProperty({
    description: 'Profile name',
    example: '山田 太郎',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Profile name kana',
    example: 'ヤマダ タロウ',
  })
  @IsNotEmpty()
  @IsString()
  name_kana: string;

  @ApiProperty({
    description: 'birthdate',
    example: '2021-01-01',
  })
  @IsNotEmpty()
  @IsString()
  birthdate: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '09000000000',
  })
  @IsNotEmpty()
  @IsString()
  contact_phone_number: string;

  @ApiProperty({
    description: 'Cell phone number',
    example: '09000000000',
  })
  @IsNotEmpty()
  @IsString()
  cell_phone_number: string;

  @ApiProperty({
    description: 'Postal Code',
    example: '1111111',
  })
  @IsNotEmpty()
  @IsString()
  postal_code: string;

  @ApiProperty({
    description: 'address',
    example: '東京都豊島区1-1-1',
  })
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'visa classification',
    example: 0,
  })
  @IsNotEmpty()
  @IsNumber()
  visa_classification_code: number;
  @ApiProperty({
    description: 'visa date',
    example: '2020-04-28',
  })
  @IsString()
  visa_period_of_validity_date: string;
}
