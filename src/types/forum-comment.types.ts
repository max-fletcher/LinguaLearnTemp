import mongoose from 'mongoose';

export type TComment = {
  order: number;
  commentator_id: string;
  text: string;
  thumbnail_url: string;
};

export type TForumCommentReply = {
  userId: string;
  comment: string;
  timestamp: Date;
};

export type TForumComment = {
  _id?: mongoose.Types.ObjectId;
  userId: string;
  uniqueId: string;
  forumId: string;
  comments: string;
  replies?: TForumCommentReply[];
};
