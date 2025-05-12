import mongoose, { Schema } from 'mongoose';
import { TConnection } from '../../../types/connection.types';
import { PRO_CONNECT_REQ_STATUS, ProConnectReqStatus } from '../../../constants/enums';

const connectionSchema = new Schema<TConnection>({
  uniqueId: {
    type: String,
    unique: true,
    index: true,
  },
  admin_user_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: PRO_CONNECT_REQ_STATUS,
    default: ProConnectReqStatus.PENDING
  },
}, { timestamps : true });

const ConnectionModel = mongoose.model<TConnection>('Connection', connectionSchema);

export default ConnectionModel;