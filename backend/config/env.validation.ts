import * as Joi from 'joi';

/**
 * Validations => env variables
 */
export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.number().required(),
  HTTP_BASIC_USER: Joi.string().required(),
  HTTP_BASIC_PASS: Joi.string().required(),
});
