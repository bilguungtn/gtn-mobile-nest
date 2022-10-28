import { Injectable, ValidationPipe } from '@nestjs/common';

import { CustomValidationError } from 'src/common/exceptions';

@Injectable()
export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      whitelist: true,
      exceptionFactory: (errors) => new CustomValidationError(errors),
    });
  }
}
