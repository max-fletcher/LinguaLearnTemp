import mongoose from 'mongoose';
import { TCreateEduContentPurchase } from '../types/edu-content-purchase.types';

export function mapEduContentPurchaseModel(
  uniqueId: string,
  edu_content_id: mongoose.Types.ObjectId,
  user_id: string,
): TCreateEduContentPurchase {
  return {
    uniqueId: uniqueId,
    edu_content_id: edu_content_id,
    user_id: user_id,
  };
}
