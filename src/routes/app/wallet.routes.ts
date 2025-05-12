import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { appUserVerifiedMiddleware } from '../../middleware/verified.middleware';
import { appUserUsernameSetMiddleware } from '../../middleware/appUserUsernameSet.middleware';
import { getUserWalletInfScroll, getUserWalletInfScrollDesktop } from '../../controllers/app/wallet.controller';

const jwtMiddleware = new JwtMiddleware();
const appWalletRouter = express.Router();

// Define routes
appWalletRouter.get(
  '/',
  jwtMiddleware.verifyAppUserToken,
  appUserVerifiedMiddleware,
  appUserUsernameSetMiddleware,
  getUserWalletInfScroll,
);

appWalletRouter.get(
  '/desktop',
  jwtMiddleware.verifyAppUserToken,
  appUserVerifiedMiddleware,
  appUserUsernameSetMiddleware,
  getUserWalletInfScrollDesktop,
);

export { appWalletRouter };
