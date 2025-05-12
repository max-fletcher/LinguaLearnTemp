import mongoose, { Schema } from 'mongoose';
import { TEduContentPurchase } from '../../../types/edu-content-purchase.types';

const educationalContentPurchaseSchema = new Schema<TEduContentPurchase>({
  uniqueId: {
    type: String,
    unique: true,
    index: true,
  },
  edu_content_id: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "EducationalContent"
  },
  user_id: {
    type: String,
    required: true,
  },
  downloaded: {
    type: Boolean,
    required: false,
    default: false,
  },
}, { timestamps : true });

const EduContentPurchaseModel = mongoose.model<TEduContentPurchase>('EduContentPurchase', educationalContentPurchaseSchema);

export default EduContentPurchaseModel;
