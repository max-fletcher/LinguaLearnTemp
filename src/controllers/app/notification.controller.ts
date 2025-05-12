import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { AppUserPayload } from '../../schema/token-payload.schema';
import { NotificationService } from '../../services/notification.service';
import { AppAuthenticatedRequest } from '../../types/authenticate.type';
import { NotificationDataType } from '../../types/notification.type';
import { NotificationSearchCategories /* , NotificationUserType */ } from '../../constants/enums';
import { FirebaseNotificationService } from '../../services/firebase-notification.service';
import { ObjectType } from 'dynamoose/dist/General';
import { jobQueue } from '../../utils/queue';
import { BadRequestException } from '../../errors/BadRequestException.error';

const notificationService = new NotificationService();
const firebaseService = FirebaseNotificationService.getInstance();

export async function getNotifications(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const data = await notificationService.getAllNotification(
      req.user as AppUserPayload,
    );

    return res.json({
      data: {
        notifications: data,
      },
      status_code: 200,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function getNotificationsInfScroll(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const { lastKey, limit } = req.body;
    const category = req.body.category ?? NotificationSearchCategories.ALL;
    const { totalAllNotificationsCount, totalUnseenNotificationsCount, results, exclusiveStartKey } =
      await notificationService.getAllNotificationInfScroll(req.user as AppUserPayload, lastKey as ObjectType, category, limit);

    return res.json({
      data: {
        totalAllNotificationsCount,
        totalUnseenNotificationsCount,
        lastKey: exclusiveStartKey ?? undefined,
        notifications: results,
      },
      status_code: 200,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function storeNotification(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const data = {
      user_id: req.user?.id,
      title: 'Notification Title',
      body: 'Notification body',
      url_path: '/home',
      // status: 0,
      // type: NotificationUserType.APPUSER,
    };

    const response = await notificationService.storeNotification(
      data as unknown as NotificationDataType,
    );

    return res.status(201).json({
      data: {
        message: response,
      },
      status_code: 201,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function updateSeenNotification(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    await notificationService.updateSeenNotification(
      req.user as AppUserPayload,
    );

    return res.json({
      data: {
        message: 'Notification marked as completed!',
      },
      status_code: 200,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function updateSeenMultipleNotification(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  const { notificationIds } = req.body;

  try {
    await notificationService.updateSeenMultipleNotification(req.user as AppUserPayload, notificationIds);

    return res.json({
      data: {
        message: 'Notifications marked as completed!',
      },
      status_code: 200,
    });
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function generateAppDeviceToken(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await firebaseService.generateAppDeviceToken(
      req.user as AppUserPayload,
      req.body,
    );

    return res.status(response.status).send(response);
  } catch (error) {
    // console.log(error);
    if (error instanceof CustomException) {
      return res.status(error.statusCode).json({
        error: {
          message: error.message,
        },
        code: error.statusCode,
      });
    }

    return res.status(500).json({
      error: {
        message: 'Something went wrong! Please try again.',
      },
      code: 500,
    });
  }
}

export async function testNotification(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const { title, body, user_id } = req.body;
    const response = await firebaseService.processAppNotification(
      user_id,
      title,
      body,
      req.body
    );

    return res.status(200).send(response);
  } catch (error) {
    // console.log(error);
    return res.status(500).send(error);
  }
}

export async function sendNotificationToAllAppUser(
  req: AppAuthenticatedRequest,
  res: Response,
) {
  try {
    const { password, title, message } = req.body;

    if(!password || password !== 'overridesendnotificationtoappusers')
      throw new BadRequestException('Not authorized to send notifications to all users.');

    jobQueue.now('sendNotificationToAllAppUser', { title: title, message: message });

    return res.json({
      data: {
        title: title,
        message: 'Notification pushed to queue successfully. Please wait for it to be resolved.',
      },
      status_code: 200,
    });
  } catch (e) {
    console.log(e);
    if (e instanceof CustomException) {
      return res.status(e.statusCode).json({
        error: {
          message: e.message,
        },
        code: e.statusCode,
      });
    }

    return res.status(500).send(e);
  }
}