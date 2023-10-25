const { isValidObjectId } = require('mongoose');
const { HttpError } = require('../helpers/HttpError');

console.log(isValidObjectId);

// Проверка того что id может быть id(меньше или больше символов, некорректность ввода). По умолчанию выбрасывает ошибку 500
const isValidId = (req, res, next) => {
  const { contactId } = req.params;
  if (!isValidObjectId(contactId)) {
    return next(HttpError(404, `${contactId} is not a valid id`));
  }
  next();
};

module.exports = isValidId;
