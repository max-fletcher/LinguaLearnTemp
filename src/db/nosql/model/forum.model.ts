import mongoose, { Schema } from 'mongoose';
import { TForum } from '../../../types/forum.types';
import { FORUM_STATUS, ForumStatus, UserTypes } from '../../../constants/enums';

const forumSchema = new Schema<TForum>(
  {
    uniqueId: {
      type: String,
      unique: true,
      index: true,
    },
    userId: {
      type: String,
      required: false,
    },
    adminUserId: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    userType: {
      type: String,
      enum: [UserTypes.ADMIN, UserTypes.USER],
      required: true,
    },
    status: {
      type: String,
      enum: FORUM_STATUS,
      required: true,
      default: ForumStatus.PENDING,
    },
    isFeatured: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  { timestamps: true },
);

const ForumModel = mongoose.model<TForum>('Forum', forumSchema);

export default ForumModel;
