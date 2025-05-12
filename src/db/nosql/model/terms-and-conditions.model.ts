import mongoose, { Schema } from 'mongoose';
import { TTermsAndCondition } from '../../../types/terms-and-conditions.types';

const termsAndConditionsSchema = new Schema<TTermsAndCondition>(
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

const TermsAndConditionsModel = mongoose.model<TTermsAndCondition>(
  'TermsAndConditions',
  termsAndConditionsSchema,
);

export default TermsAndConditionsModel;
