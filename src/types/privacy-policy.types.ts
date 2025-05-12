import mongoose from 'mongoose';

export type TPrivacyPolicy = {
  _id?: mongoose.Types.ObjectId;
  text: string;
  version: number;
};
