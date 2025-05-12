import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { appUserVerifiedMiddleware } from '../../middleware/verified.middleware';
import {
  getAllTiers,
  getPackagePageData,
  getSingleTierById,
  getUserActiveTiers,
  purchaseTier,
} from '../../controllers/app/tier.controller';
import { appUserUsernameSetMiddleware } from '../../middleware/appUserUsernameSet.middleware';
import { purchaseTierSchema } from '../../schema/tiers.schema';
import { validateRequestBody } from '../../utils/validatiion.utils';

const jwtMiddleware = new JwtMiddleware();
const appTierRouter = express.Router();

// Define routes
appTierRouter
  .get('/', getAllTiers)
  .get(
    '/user_active_tiers',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    getUserActiveTiers,
  )
  .post(
    '/purchase',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    validateRequestBody(purchaseTierSchema),
    purchaseTier,
  )
  .get(
    '/get_package_page_data',
    jwtMiddleware.verifyAppUserToken,
    appUserVerifiedMiddleware,
    appUserUsernameSetMiddleware,
    getPackagePageData,
  )
  .get('/:id', getSingleTierById);

export { appTierRouter };
