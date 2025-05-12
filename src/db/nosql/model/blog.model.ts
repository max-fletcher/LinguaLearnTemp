import mongoose, { Schema } from 'mongoose';
import { TBlog } from '../../../types/blog.types';
import { BLOG_STATUS, BlogStatus } from '../../../constants/enums';

const blogSchema = new Schema<TBlog>(
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
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: false,
    },
    thumbnail_image: {
      type: String,
      required: false,
    },
    read_duration: {
      type: Number,
      min: 1,
      required: false,
    },
    status: {
      type: String,
      enum: BLOG_STATUS,
      required: true,
      default: BlogStatus.DRAFT,
    },
  },
  { timestamps: true },
);

const BlogModel = mongoose.model<TBlog>('Blog', blogSchema);

export default BlogModel;
