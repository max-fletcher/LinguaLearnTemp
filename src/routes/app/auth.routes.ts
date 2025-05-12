import express from 'express';
import {
  authenticateAppUser,
  verifyOTP,
  resendOTP,
  usernameExists,
} from '../../controllers/app/auth.controller';
import { validateRequestBody } from '../../utils/validatiion.utils';
import {
  phoneNoSchema,
  appVerifyOtpSchema,
  nameAndUsernameSchema,
} from '../../schema/app-auth.schema';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { appUserVerifiedMiddleware } from '../../middleware/verified.middleware';

const jwtMiddleware = new JwtMiddleware();
const appAuthRouter = express.Router();

// Define routes
appAuthRouter
  .post('/login', validateRequestBody(phoneNoSchema), authenticateAppUser)
  .post(
    '/verifyOTP',
    jwtMiddleware.verifyAppUserToken,
    validateRequestBody(appVerifyOtpSchema),
    verifyOTP,
  )
  .post(
    '/resendOTP',
    jwtMiddleware.verifyAppUserToken,
    resendOTP
  )
  .post(
    '/username_exists',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    validateRequestBody(nameAndUsernameSchema),
    usernameExists,
  );

export { appAuthRouter };
