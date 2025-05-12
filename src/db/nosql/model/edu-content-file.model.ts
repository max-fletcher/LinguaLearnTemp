import mongoose, { Schema } from 'mongoose';
import { TEduContentFile } from '../../../types/edu-content-files.types';

const educationalContentFileSchema = new Schema<TEduContentFile>(
  {
    uniqueId: {
      type: String,
      unique: true,
      index: true,
    },
    edu_content_id: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'EducationalContent',
    },
    file_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const EduContentFileModel = mongoose.model<TEduContentFile>(
  'EduContentFile',
  educationalContentFileSchema,
);

export default EduContentFileModel;
