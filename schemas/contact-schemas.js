const Joi = require('joi');

const genderList = ['male', 'female'];
const birthYearRegexp = /^\d{4}$/;
const phoneRegexp = /^[0-9]+$/;

const contactAddSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    'any.required': `"name" must be exist`,
    'string.base': `"name" must be string"`,
  }),
  email: Joi.string()
    .required()
    .messages({
      'any.required': `"email" must be exist`,
      'string.base': `"email" must be string"`,
    })
    .email(),
  phone: Joi.string().min(7).max(14).required().messages({
    'any.required': `"phone" must be exist`,
    'string.base': `"phone" must be string"`,
  }),
  favorite: Joi.boolean(),
  gender: Joi.string().valid(...genderList),
  birthYear: Joi.string().pattern(birthYearRegexp),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).messages({
    'string.base': `"name" must be string"`,
  }),
  email: Joi.string().messages({
    'string.base': `"email" must be string"`,
  }),
  phone: Joi.string().min(7).max(14).pattern(phoneRegexp).messages({
    'string.base': `"phone" must be string"`,
  }),
  favorite: Joi.boolean(),
  gender: Joi.string().valid(...genderList),
  birthYear: Joi.string().pattern(birthYearRegexp),
});

const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
};
