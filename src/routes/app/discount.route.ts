import express from 'express';
// import { JwtMiddleware } from '../../middleware/jwt.middleware';
// import { appUserVerifiedMiddleware } from '../../middleware/verified.middleware';
// import { appUserUsernameSetMiddleware } from '../../middleware/appUserUsernameSet.middleware';
import { getPublishedDiscounts } from '../../controllers/app/discounts.controller';

const appDiscountRouter = express.Router();
// const jwtMiddleware = new JwtMiddleware();

appDiscountRouter.get(
  '/',
  // jwtMiddleware.verifyAppUserToken,
  // appUserVerifiedMiddleware,
  // appUserUsernameSetMiddleware,
  getPublishedDiscounts,
);

export { appDiscountRouter };
