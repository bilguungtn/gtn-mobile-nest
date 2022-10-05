import { UserResponseDto } from 'src/user/dto/responses/user.dto';

export class LoginResponseDto {
  user: UserResponseDto;
  access_token: string;
}
