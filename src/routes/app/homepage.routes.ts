import express from 'express';
import { getHomepageData } from '../../controllers/app/homepage.controller';
import { JwtMiddleware } from '../../middleware/jwt.middleware';

const homepageRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define routes
homepageRouter.get('/', jwtMiddleware.optionalVerifyAppUserToken, getHomepageData);

export { homepageRouter };
