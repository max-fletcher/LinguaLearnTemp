import express from 'express';
import {
  generateAppDeviceToken,
  getNotifications,
  getNotificationsInfScroll,
  sendNotificationToAllAppUser,
  storeNotification,
  testNotification,
  updateSeenMultipleNotification,
  updateSeenNotification,
} from '../../controllers/app/notification.controller';
import { JwtMiddleware } from '../../middleware/jwt.middleware';
import { firebaseValidationSchema } from '../../schema/firebase-notification.schema';
import { validateRequestBody } from '../../utils/validatiion.utils';

const notificationRouter = express.Router();
const jwtMiddleware = new JwtMiddleware();

// Define routes
notificationRouter.get('/', jwtMiddleware.verifyAppUserToken, getNotifications);
notificationRouter.post(
  '/inf_scroll',
  jwtMiddleware.verifyAppUserToken,
  getNotificationsInfScroll,
);
notificationRouter.post(
  '/',
  jwtMiddleware.verifyAppUserToken,
  storeNotification,
);
notificationRouter.put(
  '/mark_as_seen',
  jwtMiddleware.verifyAppUserToken,
  updateSeenNotification,
);

notificationRouter.put(
  '/mark_as_seen_multiple',
  jwtMiddleware.verifyAppUserToken,
  updateSeenMultipleNotification,
);

notificationRouter.post(
  '/generate-device-token',
  jwtMiddleware.verifyAppUserToken,
  validateRequestBody(firebaseValidationSchema),
  generateAppDeviceToken,
);

notificationRouter.post(
  '/test-app-notification',
  jwtMiddleware.verifyAppUserToken,
  testNotification,
);

notificationRouter.post(
  '/send-notification-to-all-app-users',
  sendNotificationToAllAppUser,
);

export { notificationRouter };
