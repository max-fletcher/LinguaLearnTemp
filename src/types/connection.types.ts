import mongoose from 'mongoose';
import { ProConnectReqStatus } from '../constants/enums';

export type TConnection = {
  _id?: mongoose.Types.ObjectId,
  uniqueId: string,
  admin_user_id: string,
  user_id: string,
  status: ProConnectReqStatus
}
