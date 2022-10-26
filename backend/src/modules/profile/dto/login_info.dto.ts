import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginInfoDto {
  @ApiProperty({ description: 'email address', example: 'test01@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;
}
