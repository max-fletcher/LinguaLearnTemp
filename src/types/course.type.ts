import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { CourseModel } from '../db/rdb/models';

export type Course = InferAttributes<CourseModel>;

export type StoreCourse = InferCreationAttributes<CourseModel> & {
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreCourseData = Omit<StoreCourse, 'id'>;

export type UpdateCourseData = Partial<StoreCourseData>;