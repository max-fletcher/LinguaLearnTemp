import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { LessonModel } from '../db/rdb/models/lesson.model';

export type Lesson = InferAttributes<LessonModel>;

export type StoreLesson = InferCreationAttributes<LessonModel> & {
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreLessonData = Omit<StoreLesson, 'id'>;

export type UpdateLessonData = Partial<StoreLessonData>;