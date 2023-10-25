const Joi = require('joi');

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': '"name" must be exist"',
    'string.base': '"name" must be string"',
  }),
  email: Joi.string().required().messages({
    'any.required': '"email" must be exist"',
    'string.base': '"email" must be string"',
  }),
  phone: Joi.string().required().messages({
    'any.required': '"phone" must be exist"',
    'string.base': '"phone" must be string"',
  }),
  favorite: Joi.boolean(),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().messages({
    'string.base': '"name" must be string"',
  }),
  email: Joi.string().messages({
    'string.base': '"email" must be string"',
  }),
  phone: Joi.string().messages({
    'string.base': '"phone" must be string"',
  }),
  favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
};
