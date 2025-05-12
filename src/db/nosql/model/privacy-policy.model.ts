import mongoose, { Schema } from 'mongoose';
import { TPrivacyPolicy } from '../../../types/privacy-policy.types';

const privacyPolicySchema = new Schema<TPrivacyPolicy>(
  {
    text: {
      type: String,
      required: true,
    },
    version: {
      type: Number,
      required: true,
      min: 1.0,
    },
  },
  { timestamps: true },
);

const PrivacyPolicyModel = mongoose.model<TPrivacyPolicy>(
  'PrivacyPolicy',
  privacyPolicySchema,
);

export default PrivacyPolicyModel;
