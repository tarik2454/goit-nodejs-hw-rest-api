const express = require('express');
const { validateBody } = require('../../decorators/index');
const {
  contactAddSchema,
  contactUpdateSchema,
  contactUpdateFavoriteSchema,
} = require('../../schemas/contact-schemas');
const isValidId = require('../../middlewares/index');

const router = express.Router();

const contactsController = require('../../controllers/contacts-controller');

router.get('/', contactsController.getAll);

router.get('/:contactId', isValidId, contactsController.getById);

router.post('/', validateBody(contactAddSchema), contactsController.addContact);

router.put(
  '/:contactId',
  isValidId,
  validateBody(contactUpdateSchema),
  contactsController.updateById
);

router.patch(
  '/:contactId/favorite',
  isValidId,
  validateBody(contactUpdateFavoriteSchema),
  contactsController.updateById
);

router.delete('/:contactId', isValidId, contactsController.deleleteById);

module.exports = router;
