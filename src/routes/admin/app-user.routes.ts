import express from 'express';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { createAppUser, deleteAppUser, getAllAppUsers, getSingleAppUser, updateAppUser } from '../../controllers/admin/app-user.controller';
import { validateRequestBody } from '../../utils/validatiion.utils';
import { createAppUserSchema, updateAppUserSchema } from '../../schema/app-user.schema';
import { multipleFileLocalUploader } from '../../middleware/fileUploadLocal.middleware';

const appUserRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

appUserRouter.get('/', jwtMiddleware.verifyToken, getAllAppUsers);
appUserRouter.get('/:id', jwtMiddleware.verifyToken, getSingleAppUser);
appUserRouter.post(
  '/',
  jwtMiddleware.verifyToken,
  multipleFileLocalUploader(
    [
      { name: 'avatarUrl', maxCount: 1 },
    ],
    'users',
    1048576, // 5 MB
  ),
  validateRequestBody(createAppUserSchema),
  createAppUser,
);
appUserRouter.patch(
  '/:id',
  jwtMiddleware.verifyToken,
  multipleFileLocalUploader(
    [
      { name: 'avatarUrl', maxCount: 1 },
    ],
    'users',
    1048576, // 5 MB
  ),
  validateRequestBody(updateAppUserSchema),
  updateAppUser,
);

appUserRouter.delete('/:id', jwtMiddleware.verifyToken, deleteAppUser);

export { appUserRouter };
