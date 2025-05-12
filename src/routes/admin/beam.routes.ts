import express from 'express';
import { beamsClient } from '../../config/beam.config';
import { authorizedPusherChannel } from '../../controllers/admin/pusher.controller';
import { PusherService } from '../../services/pusher.service';
import { NotificationDataType } from '../../types/notification.type';

const beamRouter = express.Router();
const pusherService = new PusherService();

// Route to authenticate users
beamRouter.get('/beams-auth', (req, res) => {
  const userId = req.query.user_id as string;

  const beamsToken = beamsClient.generateToken(userId);
  // console.log(beamsToken);
  res.json(beamsToken);
});

beamRouter.post('/channel-auth/:user_id', authorizedPusherChannel);

beamRouter.post('/send-notification', (req, res) => {
  try {
    const userId = req.body.userId as string;

    if (!userId) {
      return res.status(400).send({
        message: 'User ID is required',
      });
    }

    beamsClient
      .publishToUsers([userId], {
        web: {
          notification: {
            title: 'Notification Tester',
            body: 'Your Notficiation is tested sucesfully!',
            deep_link: 'http://localhost:3000/user/profile',
          },
        },
      })
      .then(async (response) => {
        const notification = {
          title: 'Notification Tester',
          body: 'Your Notficiation is tested sucesfully!',
        };
        await pusherService.sendUserChannelNotification(
          userId,
          notification as NotificationDataType,
        );
        // console.log('Notification sent successfully:', response);
        return res.send(response);
      })

      .catch((error) => console.error('Error sending notification:', error));
  } catch (error) {
    // console.log(error);
    return res.status(500).send({
      message: `${error}`,
    });
  }
});

export default beamRouter;
