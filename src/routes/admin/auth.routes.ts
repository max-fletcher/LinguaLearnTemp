import express from 'express';
import { validateRequestBody } from '../../utils/validatiion.utils';
import {
  loginRequestSchema,
  // passwordResetSchema,
} from '../../schema/login.schema';
import {
  login,
  // resetPassword,
} from '../../controllers/admin/auth.controller';
// import { JwtMiddleware } from '../../middleware/jwt.middleware';
// import multer from 'multer';

// const formData = multer();
const adminAuthRouter = express.Router();
// const jwtMiddleware = new JwtMiddleware();

// Define Routes

adminAuthRouter.post('/login', validateRequestBody(loginRequestSchema), login);

// adminAuthRouter.post(
//   '/reset-password',
//   formData.none(),
//   validateRequestBody(passwordResetSchema),
//   jwtMiddleware.verifyToken,
//   resetPassword,
// );

export { adminAuthRouter };
