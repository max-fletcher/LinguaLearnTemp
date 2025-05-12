import mongoose from 'mongoose';

export type TLearningResource = {
  _id?: mongoose.Types.ObjectId;
  edu_content_id: mongoose.Types.ObjectId;
  auction_id: string;
};
