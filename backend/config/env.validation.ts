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
  AUTH0_ISSUER_URL: Joi.string().required(),
  AUTH0_AUDIENCE: Joi.string().required(),
  AWS_SES_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SES_DEFAULT_REGION: Joi.string().required(),
  AWS_SES_SECRET_ACCESS_KEY: Joi.string().required(),
  MAIL_FROM_ADDRESS: Joi.string().required(),

  REDIS_URL: Joi.string().required(),
});
