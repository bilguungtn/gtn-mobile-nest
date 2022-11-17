import { Injectable } from '@nestjs/common';
import { UnauthorizedUserException } from 'src/common/exceptions/unauthorized.exception';
import { JwtPayloadDto } from './dto/payload.dto';
import { TokenResponseDto } from './dto/response/tokenResponse.dto';

@Injectable()
export class AuthService {
  /**
   * Validate user.
   * @param {JwtPayloadDto} payload
   * @returns {UserResponseDto}
   */
  async validateToken(payload: JwtPayloadDto): Promise<TokenResponseDto> {
    // TODO: env('AUTH0_MOBILE_APPLICATION_CLIENT_ID') !== $decodedToken["aud"]
    if (payload.exp < 1 || payload.iss !== process.env.AUTH0_ISSUER_URL)
      throw new UnauthorizedUserException();
    const { gtn_id } = payload['https://gtn-id.com/user_metadata'];
    if (!gtn_id) {
      throw new UnauthorizedUserException();
    }
    return { gtn_id };
  }
}
