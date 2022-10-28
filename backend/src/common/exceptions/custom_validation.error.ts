import { ValidationError } from 'class-validator';

export class CustomValidationError {
  constructor(public errors: ValidationError[]) {}
}
