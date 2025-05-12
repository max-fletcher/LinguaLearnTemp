import mongoose, { Schema } from 'mongoose';
import { TForumComment } from '../../../types/forum-comment.types';

export const commentSchema = new Schema<TForumComment>(
  {
    uniqueId: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
    },
    forumId: {
      type: String,
      required: true,
    },
    comments: {
      type: String,
      required: true,
    },
    replies: {
      type: JSON,
      required: false,
    },
  },
  { timestamps: true },
);

const ForumCommentModel = mongoose.model<TForumComment>(
  'ForumComment',
  commentSchema,
);

export default ForumCommentModel;
