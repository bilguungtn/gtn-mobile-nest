export class JwtPayloadDto {
  iat: number;
  exp: number;
  aud: string;
  iss: string;
  sub: number;
}
