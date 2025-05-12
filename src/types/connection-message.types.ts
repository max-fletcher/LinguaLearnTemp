import mongoose from 'mongoose';

export type TConnectionMessage = {
  _id?: mongoose.Types.ObjectId;
  connection_id: mongoose.Types.ObjectId;
  sent_by_user: boolean;
  message: string;
  file_url: string;
  is_seen: boolean;
};
