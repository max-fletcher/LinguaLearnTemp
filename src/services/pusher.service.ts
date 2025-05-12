import { beamsClient } from '../config/beam.config';
import { CustomException } from '../errors/CustomException.error';
import { NotificationDataType } from '../types/notification.type';
import { BeamMessageDataType } from '../types/pusher.type';
import { pusherServer } from '../utils/pusher';

export type TPusherUserInfo = {
  name: string | null;
  username: string | null;
  avatar: string | null;
};

export class PusherService {
  async sendPusherBeamEvent(userId: string, data: BeamMessageDataType) {
    beamsClient
      .publishToUsers([userId], {
        web: {
          notification: {
            title: data.title,
            body: data.body,
            deep_link: data.deep_link,
          },
        },
      })
      .then((response) => {
        console.log('Notification sent successfully:', response);
      })

      .catch((error) => {
        throw new CustomException(error, 500);
      });
  }

  async authorizePusherUser(
    socketId: string,
    channel: string,
    id: string,
    userInfo: TPusherUserInfo,
  ) {
    const presenceData = {
      user_id: id,
      user_info: userInfo,
    };

    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channel,
      presenceData,
    );
    return authResponse;
  }

  async sendUserChannelNotification(userId: string, data: NotificationDataType) {
    const channelName = `user-notification-${userId}`;
    const eventName = 'receive-notification';
    pusherServer.trigger(`${channelName}`, `${eventName}`, data);
  }
}
