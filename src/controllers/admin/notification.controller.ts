import { Response } from 'express';
import { CustomException } from '../../errors/CustomException.error';
import { UserPayload } from '../../schema/token-payload.schema';
import { NotificationService } from '../../services/notification.service';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';
import { NotificationDataType } from '../../types/notification.type';

const notificationService = new NotificationService();

export async function getNotifications(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const data = await notificationService.getAllNotification(
      req.user as UserPayload,
    );

    return res.send(data);
  } catch (error) {
    if (error instanceof CustomException) {
      return res.status(error.statusCode).send({
        message: error.message,
      });
    }
    // console.log(error);
    throw new CustomException('Bad Request', 400);
  }
}

export async function storeNotifications(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const data = {
      user_id: req.user?.id,
      title: 'Notification Title',
      body: 'Notification body',
      url_path: '/home',
    };

    const response = await notificationService.storeNotification(
      data as NotificationDataType,
    );

    return res.send({
      message: response,
    });
  } catch (error) {
    // console.log(error);
    throw new CustomException('Bad Request', 400);
  }
}

export async function updateSeenNotification(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    await notificationService.updateSeenNotification(req.user as UserPayload);

    return res.send({
      message: 'Notification marked as completed!',
    });
  } catch (error) {
    // console.log(error);
    throw new CustomException('Bad Request', 400);
  }
}
