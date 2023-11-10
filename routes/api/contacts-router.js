const express = require('express');

const contactsController = require('../../controllers/contacts-controller');
const { validateBody } = require('../../decorators/index');
const {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} = require('../../schemas/contact-schemas');
const { isValidId, authenticate, upload } = require('../../middlewares/index');

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:contactId', isValidId, contactsController.getById);

// upload.fields([{name: "foto", maxCount:1}, {name: "poster", maxCount:3}]) - если ожидаем получить файлы из нескольких полей
// upload.array("foto", 8) - если нужно добавить больше чем один файл, 8 -количество добавляемых файлов
contactsRouter.post(
  '/',
  upload.single('fotoUrl'),
  validateBody(contactAddSchema),
  contactsController.addContact
);

contactsRouter.put(
  '/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  contactsController.updateById
);

contactsRouter.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(contactUpdateFavoriteSchema),
  contactsController.updateById
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  contactsController.deleleteById
);

module.exports = contactsRouter;
