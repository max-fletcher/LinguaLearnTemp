import { QueryResponse } from 'dynamoose/dist/ItemRetriever';
import { NotificationSearchCategories, NotificationUserType } from '../constants/enums';
import { CustomException } from '../errors/CustomException.error';
import { AppUserPayload, UserPayload } from '../schema/token-payload.schema';
import { NotificationDataForInfScroll, NotificationDataType } from '../types/notification.type';
import { generateNotificationId } from '../utils/id.utils';
import { FirebaseNotificationService } from './firebase-notification.service';
import { PusherService } from './pusher.service';
import { ObjectType } from 'dynamoose/dist/General';
import { NotificationRepository } from '../db/rdb/repositories/notification.repository';

export class NotificationService {
  private notificationRepository: NotificationRepository;
  private pusherService: PusherService;
  private firebaseService;

  constructor() {
    this.notificationRepository = new NotificationRepository();
    this.firebaseService = FirebaseNotificationService.getInstance();
    this.pusherService = new PusherService();
  }

  async getAllNotification(user: UserPayload | AppUserPayload) {
    try {
      return await this.notificationRepository.getAllNotifications(
        user.id as string,
      );
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong!', 500);
    }
  }

  async getAllNotificationInfScroll(
    user: UserPayload | AppUserPayload,
    lastKey: ObjectType | null,
    category: NotificationSearchCategories,
    limit: number = 10,
  ): Promise<{
    totalAllNotificationsCount: number;
    totalUnseenNotificationsCount : number;
    results: QueryResponse<NotificationDataForInfScroll>;
    exclusiveStartKey: ObjectType | null;
  }> {
    try {
      if(category === NotificationSearchCategories.UNSEEN) {
        const { totalAllNotificationsCount, totalUnseenNotificationsCount, results, exclusiveStartKey } = await this.notificationRepository.getUnseenNotificationsInfScroll(user.id as string, lastKey, limit);

        return { totalAllNotificationsCount, totalUnseenNotificationsCount, results, exclusiveStartKey };
      }

      const { totalAllNotificationsCount, totalUnseenNotificationsCount, results, exclusiveStartKey } = await this.notificationRepository.getAllNotificationsInfScroll(user.id as string, lastKey, limit);

      return { totalAllNotificationsCount, totalUnseenNotificationsCount, results, exclusiveStartKey };
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong!', 500);
    }
  }

  async getAllUnseenNotificationsCount(userId: string): Promise<number> {
    return await this.notificationRepository.getAllUnseenNotificationsCount(userId);
  }

  async storeNotification(data: NotificationDataType, forcePush = true) {
    try {
      const notification = {
        ...data,
        id: generateNotificationId(),
        status: 0,
        createdAt: new Date().toISOString(),
      };

      const res = await this.notificationRepository.storeNotification(
        notification as NotificationDataType,
      );

      if (forcePush) {
        await this.pusherService.sendPusherBeamEvent(data.user_id, {
          title: data.title,
          body: data.body,
        });

        await this.pusherService.sendUserChannelNotification(data.user_id, notification);

        if(data.type === NotificationUserType.APPUSER){
          const dataBody = {
            icon: data.icon,
            link_title: data.link_title,
            url_path: data.url_path,
            url_path_desktop: data.url_path_desktop,
          }

          await this.firebaseService.processAppNotification(
            data.user_id,
            data.title,
            data.body,
            dataBody
          );
        }
        else{
          await this.firebaseService.processAppNotification(
            data.user_id,
            data.title,
            data.body,
          );
        }
      }

      return res;
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong!', 500);
    }
  }

  async updateSeenNotification(user: UserPayload | AppUserPayload) {
    try {
      const notification =
        await this.notificationRepository.updateSeenNotification(
          user.id as string,
        );

      return notification;
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong!', 500);
    }
  }

  async updateSeenMultipleNotification(user: UserPayload | AppUserPayload, notificationIds: string[]) {
    try {
      const notification =
        await this.notificationRepository.updateSeenMultipleNotification(
          user.id as string,
          notificationIds
        );

      return notification;
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong!', 500);
    }
  }

  async sendTestNotification(data: NotificationDataType, forcePush = true) {
    try {
      const notification = {
        ...data,
        id: generateNotificationId(),
        status: 0,
        createdAt: new Date().toISOString(),
      };

      const res = await this.notificationRepository.storeNotification(
        notification as NotificationDataType,
      );

      if (forcePush) {
        await this.pusherService.sendPusherBeamEvent(data.user_id, {
          title: data.title,
          body: data.body,
        });

        await this.pusherService.sendUserChannelNotification(data.user_id, notification);

        if(data.type === NotificationUserType.APPUSER){
          const dataBody = {
            icon: data.icon,
            link_title: data.link_title,
            url_path: data.url_path,
            url_path_desktop: data.url_path_desktop,
          }

          await this.firebaseService.processAppNotification(
            data.user_id,
            data.title,
            data.body,
            dataBody
          );
        }
        else{
          await this.firebaseService.processAppNotification(
            data.user_id,
            data.title,
            data.body,
          );
        }
      }

      return res;
    } catch (error) {
      // console.log(error);
      throw new CustomException('Something went wrong!', 500);
    }
  }

}
