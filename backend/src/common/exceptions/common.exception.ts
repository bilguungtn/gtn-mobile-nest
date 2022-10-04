import { HttpException, HttpStatus } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime';
import { PrismaError } from '../enums/prisma-error.enum';

export class CommonException extends HttpException {
  constructor(error: any) {
    super(`失敗しました。`, HttpStatus.BAD_REQUEST);

    const { message, statusCode } = this.handleException(error);
    throw new HttpException(message, statusCode);
  }

  handleException(error: any) {
    // handled exception
    if (error.status && error.response) {
      return { message: error.response, statusCode: error.status };
    }

    // un handled exception.
    if (error instanceof PrismaClientKnownRequestError) {
      switch (error.code) {
        case PrismaError.UniqueConstraint:
          return {
            message: 'Unique constraint failed.',
            statusCode: HttpStatus.BAD_REQUEST,
          };
        case PrismaError.RecordDoesNotExist:
          return {
            message:
              '"An operation failed because it depends on one or more records that were required but not found. {',
            statusCode: HttpStatus.BAD_REQUEST,
          };
      }
    }
    if (error instanceof PrismaClientValidationError) {
      return {
        message: 'DB validation error.',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }

    return { message: '失敗しました。', statusCode: HttpStatus.BAD_REQUEST };
  }
}
