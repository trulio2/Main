import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  OPENAI_API_KEY: Joi.string().required(),
});
