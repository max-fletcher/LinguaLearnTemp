import { NotificationUserType } from "../constants/enums";

export type NotificationDataType = {
  user_id: string;
  title: string;
  body: string;
  // FOR APP USERS ONLY
  icon: string,
  link_title: string,
  url_path_desktop: string;
  // END FOR APP USERS ONLY
  url_path: string;
  type: NotificationUserType;
  status: number;
  createdAt: string;
  updatedAt: string;
};

export type NotificationDataForInfScroll = {
  id: string;
  user_id: string;
  title: string;
  body: string;
  // FOR APP USERS ONLY
  icon: string,
  link_title: string,
  url_path_desktop: string;
  // END FOR APP USERS ONLY
  url_path: string;
  type: NotificationUserType;
  status: number;
  createdAt: string;
  updatedAt: string;
};