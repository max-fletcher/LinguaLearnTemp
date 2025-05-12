import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { appUserVerifiedMiddleware } from '../../middleware/verified.middleware';
import { appUserUsernameSetMiddleware } from '../../middleware/appUserUsernameSet.middleware';
import { getUserCashBalanceHistories } from '../../controllers/app/cash-balance-history.controller';

const jwtMiddleware = new JwtMiddleware();
const appTransactionRouter = express.Router();

// Define routes
appTransactionRouter.post(
  '/',
  jwtMiddleware.verifyAppUserToken,
  appUserVerifiedMiddleware,
  appUserUsernameSetMiddleware,
  getUserCashBalanceHistories,
);

export { appTransactionRouter };
