import { UserResponseDto } from 'src/modules/user/dto/responses/user.dto';

export class LoginResponseDto {
  user: UserResponseDto;
  access_token: string;
}
