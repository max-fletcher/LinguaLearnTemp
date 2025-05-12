import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { appUserVerifiedMiddleware } from '../../middleware/verified.middleware';
import { appUserUsernameSetMiddleware } from '../../middleware/appUserUsernameSet.middleware';
import {
  appUserPayoutRequestCheckValidity,
  createAppUserPayoutRequest,
  getAppUserPayoutInfScroll,
  getAppUserPayoutInfScrollDesktop,
} from '../../controllers/app/payout.controller';
import { validateRequestBody } from '../../utils/validatiion.utils';
import {
  checkPayoutValiditySchema,
  withdrawRequestSchema,
} from '../../schema/payment-request.schema';

const jwtMiddleware = new JwtMiddleware();
const appPayoutRouter = express.Router();

// Define routes
appPayoutRouter
  .get(
    '/',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    getAppUserPayoutInfScroll,
  )
  .get(
    '/desktop',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    getAppUserPayoutInfScrollDesktop,
  )
  .post(
    '/payout_request_check_validity',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(checkPayoutValiditySchema),
    appUserPayoutRequestCheckValidity,
  )
  .post(
    '/make_payout_request',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(withdrawRequestSchema),
    createAppUserPayoutRequest,
  );

export { appPayoutRouter };
