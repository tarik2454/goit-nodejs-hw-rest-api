const express = require('express');
const { validateBody } = require('../../decorators/index');
const {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} = require('../../schemas/contact-schemas');
const { isValidId, authenticate } = require('../../middlewares/index');

const contactsRouter = express.Router();

const contactsController = require('../../controllers/contacts-controller');

contactsRouter.use(authenticate);

contactsRouter.get('/', contactsController.getAll);

contactsRouter.get('/:contactId', isValidId, contactsController.getById);

contactsRouter.post(
  '/',
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
