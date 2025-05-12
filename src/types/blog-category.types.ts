import mongoose from 'mongoose';

export type TBlogCategory = {
  _id?: mongoose.Types.ObjectId;
  name: string;
};
