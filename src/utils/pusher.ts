import PusherServer from 'pusher';
import { getEnvVar } from './common.utils';

const pusherAppId = getEnvVar('PUSHER_APP_ID');
const pusherAppKey = getEnvVar('PUSHER_APP_KEY');
const pusherAppSecret = getEnvVar('PUSHER_APP_SECRET');
const pusherAppCluster = getEnvVar('PUSHER_APP_CLUSTER');

export const pusherServer = new PusherServer({
  appId: pusherAppId,
  key: pusherAppKey,
  secret: pusherAppSecret,
  cluster: pusherAppCluster,
});
