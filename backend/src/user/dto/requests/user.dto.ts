import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @IsNotEmpty()
  readonly password: string;
}
