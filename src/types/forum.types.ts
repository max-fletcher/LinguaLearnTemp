import mongoose from 'mongoose';

export type TForum = {
  _id?: mongoose.Types.ObjectId;
  uniqueId: string;
  userId?: string;
  adminUserId?: string;
  title: string;
  description: string;
  tags: string[];
  userType: string;
  status: string;
  isFeatured: boolean;
};

export type THomepageForumBeforeFormatting = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  userId: string;
  adminUserId: string;
  title: string;
  commentCount: number;
  author: null | {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
};

export type THomepageForumFormatted = {
  id: mongoose.Types.ObjectId;
  uniqueId: string;
  title: string;
  commentCount: number;
  author: null | {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  createdAt: string;
};
