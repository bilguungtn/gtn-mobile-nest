import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor() {
    super(
      'User already exists', //`User with a email "${email}" has already exists.`,
      HttpStatus.BAD_REQUEST,
    );
  }
}
