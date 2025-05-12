import mongoose, { Schema } from 'mongoose';
import { TConnectionMessage } from '../../../types/connection-message.types';

const connectionMessageSchema = new Schema<TConnectionMessage>(
  {
    connection_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    sent_by_user: {
      type: Boolean,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    file_url: {
      type: String,
      required: false,
    },
    is_seen: {
      type: Boolean,
      required: false,
    },
  },
  { timestamps: true },
);

const ConnectionMessageModel = mongoose.model<TConnectionMessage>(
  'ConnectionMessage',
  connectionMessageSchema,
);

export default ConnectionMessageModel;
