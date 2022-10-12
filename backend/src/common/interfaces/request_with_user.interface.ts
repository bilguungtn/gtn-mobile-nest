import { Request } from 'express';
import { ProfileDto } from 'src/modules/profile/dto/response/profile.dto';

export interface IRequestWithUser extends Request {
  user: ProfileDto;
}
