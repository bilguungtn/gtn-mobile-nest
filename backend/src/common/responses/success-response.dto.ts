import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SuccessResponseDto {
  @ApiProperty({ description: 'status code', example: 200 })
  @IsNotEmpty()
  @IsNumber()
  statusCode: number;
  @ApiProperty({ description: 'description', example: 'EMAIL_UPDATED' })
  @IsNotEmpty()
  @IsString()
  message: string;
}
