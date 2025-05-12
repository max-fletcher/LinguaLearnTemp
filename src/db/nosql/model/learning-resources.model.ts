import mongoose, { Schema } from 'mongoose';
import { TLearningResource } from '../../../types/learning-resource.types';

const learningResourceSchema = new Schema<TLearningResource>(
  {
    edu_content_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'EducationalContent',
    },
    auction_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const LearningResourceModel = mongoose.model<TLearningResource>(
  'LearningResource',
  learningResourceSchema,
);

export default LearningResourceModel;
