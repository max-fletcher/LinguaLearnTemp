import express from 'express';
import {
  authenticateAppUser,
  verifyOTP,
  resendOTP,
  socialLogin,
  updateNameAndUsername,
  usernameExists,
  sendOTPToWhatsappOrEmail,
  sendOTP,
  checkAuthenticationStatus,
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
    '/verifyOTP/:channel?',
    jwtMiddleware.verifyAppUserToken,
    validateRequestBody(appVerifyOtpSchema),
    verifyOTP,
  )
  .post(
    '/resendOTP',
    jwtMiddleware.verifyAppUserToken,
    resendOTP
  )
  .get(
    '/sendOTPToWhatsappOrEmail/:channel',
    jwtMiddleware.verifyAppUserToken,
    sendOTPToWhatsappOrEmail,
  )
  .post('/socialLogin/:provider', socialLogin)
  .post(
    '/username_exists',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    validateRequestBody(nameAndUsernameSchema),
    usernameExists,
  )
  .post(
    '/update_name_and_username',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    validateRequestBody(nameAndUsernameSchema),
    updateNameAndUsername,
  )
  .post('/sendOTP', jwtMiddleware.verifyAppUserToken, sendOTP)
  .get('/check_auth_status', jwtMiddleware.verifyAppUserToken, checkAuthenticationStatus);

export { appAuthRouter };
