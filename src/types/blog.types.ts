import mongoose from 'mongoose';

export type TBlog = {
  _id?: mongoose.Types.ObjectId;
  uniqueId: string;
  userId: string;
  title: string;
  text: string;
  tags: string[];
  thumbnail_image: string;
  read_duration: number;
  created_by: string;
  status: string;
  isFeatured: boolean;
  author?: any;
};

export type THomepageBlogBeforeFormatting = {
  _id: mongoose.Types.ObjectId;
  uniqueId: string;
  title: string;
  thumbnail_image: string;
  read_duration: number;
  createdAt: string;
};

export type THomepageBlogFormatted = {
  id: mongoose.Types.ObjectId;
  uniqueId: string;
  title: string;
  thumbnail_image: string;
  read_duration: number;
  createdAt: string;
};
