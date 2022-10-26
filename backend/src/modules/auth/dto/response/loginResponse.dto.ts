import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/modules/user/dto/responses/user.dto';

export class LoginResponseDto {
  @ApiProperty()
  user: UserResponseDto;
  @ApiProperty()
  access_token: string;
}
