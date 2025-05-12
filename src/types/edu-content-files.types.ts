import mongoose from 'mongoose';

export type TEduContentFile = {
  uniqueId?: string;
  edu_content_id: mongoose.Types.ObjectId;
  file_url: string;
};

export type TEduContentFileData = {
  _id: mongoose.Types.ObjectId;
  uniqueId?: string;
  edu_content_id: mongoose.Types.ObjectId;
  file_url: string;
};
