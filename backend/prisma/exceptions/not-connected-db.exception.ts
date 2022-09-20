import { BadRequestException } from '@nestjs/common';

export class NotConnectedDBException extends BadRequestException {
  constructor(error: any) {
    super(`Can't connected DB. error: ${error}`);
  }
}
