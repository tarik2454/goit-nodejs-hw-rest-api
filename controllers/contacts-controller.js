const fs = require('fs/promises');
const gravatar = require('gravatar');

const { Contact } = require('../models/contacts');
const { HttpError, cloudinary } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');

// const fotoPath = path.resolve('public', 'photos');

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10 } = req.query;

  // skip - сколько объектов нужно пропустить c начала коллекции
  // limit- сколько объектов нужно вернуть с коллекции
  const skip = (page - 1) * limit;
  const result = await Contact.find({ owner }, '-createdAt -updatedAt', {
    skip,
    limit,
  }).populate('owner', 'email subscription');

  res.json(result);
};

const getById = async (req, res) => {
  // req.params - это объект который содержит все динамические части запроса
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  // const result = await Contact.findById(contactId);
  const result = await Contact.findOne({ _id: contactId, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json(result);
};

const addContact = async (req, res) => {
  const { _id: owner } = req.user;
  let fotoURL;

  if (req.file) {
    // const { url: fotoURL } = await cloudinary.uploader.upload(req.file.path, {
    //   folder: 'contacts-project/users',
    // });
    const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, {
      folder: 'contacts-project/users',
    });
    fotoURL = cloudinaryResponse.secure_url;
    await fs.unlink(req.file.path);
  } else {
    const { email } = req.body;
    fotoURL = gravatar.url(email, { s: '200', d: 'identicon' });
  }

  const result = await Contact.create({
    ...req.body,
    fotoURL,
    owner,
  });

  res.status(201).json(result);
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;
  // const result = await Contact.findByIdAndUpdate(contactId, req.body);

  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  const { _id: owner } = req.user;

  if (!favorite) {
    return res.status(400, 'missing field favorite');
  }

  // const result = await Contact.findByIdAndUpdate(contactId, req.body);
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner },
    req.body
  );
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json(result);
};

const deleleteById = async (req, res) => {
  const { contactId } = req.params;
  const { _id: owner } = req.user;

  // const result = await Contact.findByIdAndDelete(contactId);
  const result = await Contact.findOneAndDelete({ _id: contactId, owner });
  if (!result) {
    throw HttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json({ message: 'Delete success' });
  // статус 204 не отправляет тело
  // res.status(204).json({ message: 'Delete success' });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContact: ctrlWrapper(addContact),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleleteById: ctrlWrapper(deleleteById),
};
