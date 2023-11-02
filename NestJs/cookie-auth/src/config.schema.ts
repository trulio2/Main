import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  COOKIE_SECRET: Joi.string().required(),
  PORT: Joi.number().default(3000),
});
