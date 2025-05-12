import mongoose, { Schema } from 'mongoose';
import { TBlogCategory } from '../../../types/blog-category.types';

const blogCategorySchema = new Schema<TBlogCategory>(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const BlogCategoryModel = mongoose.model<TBlogCategory>(
  'BlogCategory',
  blogCategorySchema,
);

export default BlogCategoryModel;
