const express = require('express');

const authController = require('../../controllers/auth-controller');
const { validateBody } = require('../../decorators/index');
const {
  userSignupSchema,
  userSigninSchema,
  userEmailSchema,
} = require('../../schemas/user-schemas');
const { authenticate, upload } = require('../../middlewares/index');

const authRouter = express.Router();

authRouter.post(
  '/register',
  upload.single('avatar'),
  validateBody(userSignupSchema),
  authController.signup
);

authRouter.get('/verify/:verificationToken', authController.verify);

authRouter.post(
  '/verify',
  validateBody(userEmailSchema),
  authController.resendVerifyEmail
);

authRouter.post(
  '/login',
  validateBody(userSigninSchema),
  authController.signin
);

authRouter.get('/current', authenticate, authController.getCurrent);

authRouter.post('/logout', authenticate, authController.signout);

authRouter.patch(
  '/avatars',
  authenticate,
  upload.single('avatar'),
  authController.updateAvatar
);

module.exports = { authRouter };
