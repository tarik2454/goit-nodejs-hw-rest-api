const jwt = require('jsonwebtoken');

const { HttpError } = require('../helpers/index');
const { User } = require('../models/User');

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');
  if (bearer !== 'Bearer') {
    return next(HttpError(401));
  }

  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      return next(HttpError(401));
    }
    req.user = user;
    next();
  } catch (error) {
    next(HttpError(401, error.message));
  }
};

module.exports = authenticate;
