import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  DB_DATABASE_AUTH: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_PORT: Joi.number().default(5432).required(),
  DB_USERNAME: Joi.string().required(),
});
