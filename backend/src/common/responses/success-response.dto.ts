import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SuccessResponseDto {
  @IsNotEmpty()
  @IsNumber()
  statusCode: number;
  @IsNotEmpty()
  @IsString()
  message: string;
}
