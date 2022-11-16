import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseDto {
  @ApiProperty()
  gtn_id: number;
}
