const Joi = require('joi');

const genderList = ['male', 'female'];
const birthYearRegexp = /^\d{4}$/;

const contactAddSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': `"name" must be string"`,
  }),
  email: Joi.string().required().messages({
    'string.base': `"email" must be string"`,
  }),
  phone: Joi.string().required().messages({
    'string.base': `"phone" must be string"`,
  }),
  favorite: Joi.boolean(),
  gender: Joi.string().valid(...genderList),
  birthYear: Joi.string().pattern(birthYearRegexp),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().messages({
    'string.base': `"name" must be string"`,
  }),
  email: Joi.string().messages({
    'string.base': `"email" must be string"`,
  }),
  phone: Joi.string().messages({
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
