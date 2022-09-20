import * as Joi from 'joi';

/**
 * Validations => env variables
 */
export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
});
