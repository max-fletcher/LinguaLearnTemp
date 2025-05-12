import mongoose from 'mongoose';

export type TTermsAndCondition = {
  _id?: mongoose.Types.ObjectId;
  text: string;
  version: number;
};
