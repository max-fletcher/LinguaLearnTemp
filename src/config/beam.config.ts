import PushNotifications from '@pusher/push-notifications-server';

export const beamsClient = new PushNotifications({
  instanceId: process.env.PUSHER_BEAM_INSTANCE_ID as string, // Replace with your Instance ID
  secretKey: process.env.PUSHER_BEAM_SECRET_KEY as string, // Replace with your Secret Key from the dashboard
});
