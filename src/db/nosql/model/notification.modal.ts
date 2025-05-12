import * as dynamoose from 'dynamoose';
import { Item } from 'dynamoose/dist/Item';
import { NotificationUserType } from '../../../constants/enums';

interface NotificationDataType extends Item {
  id: string;
  user_id: string;
  title: string;
  body: string;
  // FOR APP USERS ONLY
  icon: string,
  link_title: string,
  // END FOR APP USERS ONLY
  url_path: string;
  url_path_desktop: string;
  type: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

const notificationSchema = new dynamoose.Schema({
  id: {
    type: String,
    hashKey: true, // This marks it as the partition key
  },
  user_id: {
    type: String,
    required: true,
    index: {
      name: 'UserIndex',
      type: 'global',
      rangeKey: 'createdAt',
    },
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: false,
    default: ''
  },
  link_title: {
    type: String,
    required: false,
    default: ''
  },
  url_path: String,
  url_path_desktop: String,
  type: {
    type: String,
    enum: [NotificationUserType.ADMIN, NotificationUserType.APPUSER],
    required: true,
    default: NotificationUserType.ADMIN,
  },
  status: {
    type: Number,
    default: 0,
    required: true,
    index: {
      name: 'StatusIndex',
      type: 'global',
    },
  },
  createdAt: {
    type: String,
  },
  updatedAt: {
    type: String,
  },
});

const NotificationModel = dynamoose.model<NotificationDataType>(
  'staging-homerun-notification', // DynamoDB table name
  notificationSchema,
);

export default NotificationModel;
