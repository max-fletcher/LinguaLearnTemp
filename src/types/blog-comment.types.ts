import mongoose from 'mongoose';

export type TComment = {
  order: number;
  commentator_id: string;
  text: string;
  thumbnail_url: string;
};

export type TCommentReply = {
  userId: string;
  comment: string;
  timestamp: Date;
};

export type TBlogComment = {
  _id?: mongoose.Types.ObjectId;
  uniqueId: string;
  userId: string;
  blogId: mongoose.Types.ObjectId;
  comments: string;
  replies?: TCommentReply[];
};
