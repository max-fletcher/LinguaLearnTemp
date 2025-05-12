import admin from 'firebase-admin';
import path from 'path';
import { CustomException } from '../errors/CustomException.error';
import { FirebaseNotificationRepository } from '../db/rdb/repositories/firebase-notification.repository';
import { AnyStringKeyValuePair } from '../types/app.user.type';
import { AppUserRepository } from '../db/rdb/repositories/app-user.repository';
import FirebaseNotificationsModel from '../db/rdb/models/firebase-notifications';
import { generateFCMTokenId } from '../utils/id.utils';
import { AppUserPayload } from '../schema/token-payload.schema';

export class FirebaseNotificationService {
  private static instance: FirebaseNotificationService | null = null;

  private firebaseConfig: admin.ServiceAccount | string;
  private fcmInitialize: string;
  private firebaseRepo: FirebaseNotificationRepository;
  private appUserRepo: AppUserRepository;

  // Make the constructor private so it cannot be called outside this class.
  private constructor() {
    this.firebaseRepo = new FirebaseNotificationRepository();
    this.appUserRepo = new AppUserRepository();
    this.fcmInitialize = path.join(__dirname, '../serviceAccountKey.json');
    this.firebaseConfig = this.fcmInitialize;

    // Only initialize the app if it has not already been initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          this.firebaseConfig as admin.ServiceAccount
        ),
      });
    }
  }

  // Provides a global point of access to the instance.
  public static getInstance(): FirebaseNotificationService {
    if (!FirebaseNotificationService.instance) {
      FirebaseNotificationService.instance = new FirebaseNotificationService();
    }
    return FirebaseNotificationService.instance;
  }

  public async processAppNotification(
    appUserId: string,
    title: string,
    body: string,
    data?: AnyStringKeyValuePair
  ) {
    try {
      const tokens: string[] = [];
      const getTokens = await this.firebaseRepo.getUserWiseDevices(appUserId);
      // console.log('getTokens', getTokens);

      if (getTokens.length > 0) {
        for (const token of getTokens) {
          tokens.push(token.fcm_token);
        }

        // console.log('tokenzzz', tokens);

        await this.sendNotification(tokens, title, body, data);
      }
      return true;
    } catch (error) {
      throw new CustomException('Something went wrong! Please try again.', 500);
    }
  }

  // Function to send a notification to a device
  public async sendNotification(tokens: string[], title: string, body: string, data?: AnyStringKeyValuePair) {
    // console.log('sendNotification fn', tokens, title, body, data);

    const message = {
      notification: { title, body },
      apns: {
        payload: {
          aps: {
            alert: { title, body },
            sound: 'default',
            contentAvailable: true,
          },
        },
      },
      data,
      tokens,
    };

    try {
      const response = await admin.messaging().sendEachForMulticast(message);
      // console.log('Notification sent successfully:', response);

      response.responses.map((res) => {
        if(res.error)
          console.log('notification resp error', res.error);
      })

      return response;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Generate APP Device TOken
  public async generateAppDeviceToken(
    user: AppUserPayload,
    data: FirebaseNotificationsModel,
  ) {
    try {
      const id = generateFCMTokenId();
      const getUser = await this.appUserRepo.findUserById(user.id);
      let token;

      if (!getUser) {
        throw new CustomException('User not found', 404);
      }

      const deviceToken = await this.firebaseRepo.findDeviceById(
        data.device_id,
      );

      if (!deviceToken) {
        token = await this.firebaseRepo.storeFcmToken({
          ...data,
          id: id,
          user_id: user.id,
        } as FirebaseNotificationsModel);
      } else {
        await this.firebaseRepo.updateFcmToken({
          ...data,
          id: deviceToken.id,
          user_id: user.id,
        } as FirebaseNotificationsModel);

        token = await this.firebaseRepo.findDeviceById(data.device_id);
      }

      return {
        data: token,
        status: 201,
        message: 'Token generated successfully',
      };
    } catch (error) {
      // console.log(error);

      if (error instanceof CustomException) {
        throw new CustomException(error.message, error.statusCode);
      }

      throw new CustomException('Something went wrong! Please try again.', 500);
    }
  }
}