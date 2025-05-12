import mongoose, { Schema } from 'mongoose';
import { TBlogComment } from '../../../types/blog-comment.types';

export const commentSchema = new Schema<TBlogComment>(
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
    blogId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    comments: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const BlogCommentModel = mongoose.model<TBlogComment>(
  'BlogComment',
  commentSchema,
);

export default BlogCommentModel;
