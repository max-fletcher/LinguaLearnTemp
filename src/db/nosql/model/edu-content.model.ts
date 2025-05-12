import { TEducationalContent } from '../../../types/edu-content.types';
import {
  EDU_CONTENT_C_TYPES,
  EDU_CONTENT_CATEGORY_TYPES,
  EDU_CONTENT_STATUS,
  EduContentStatus,
} from '../../../constants/enums';
import mongoose, { Schema } from 'mongoose';

const educationalContentSchema = new Schema<TEducationalContent>(
  {
    uniqueId: {
      type: String,
      unique: true,
      index: true,
    },
    admin_user_id: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: EDU_CONTENT_CATEGORY_TYPES,
      required: true,
    },
    tier_order: {
      type: Number,
      required: true,
    },
    content_type: {
      type: String,
      enum: EDU_CONTENT_C_TYPES,
      required: true,
    },
    thumbnail_url: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    edu_content_files: {
      type: [mongoose.Schema.ObjectId],
      required: false,
      ref: 'EduContentFile',
    },
    currency_id: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    coins_rewarded: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    duration: {
      type: Number,
      min: 1,
    },
    stripe_product_id: {
      type: String,
      required: false,
      default: null,
    },
    stripe_price_id: {
      type: String,
      required: false,
      default: null,
    },
    status: {
      type: String,
      enum: EDU_CONTENT_STATUS,
      required: false,
      default: EduContentStatus.REQUEST_APPROVAL,
    },
  },
  { timestamps: true },
);

const EducationalContentModel = mongoose.model<TEducationalContent>(
  'EducationalContent',
  educationalContentSchema,
);

export default EducationalContentModel;
