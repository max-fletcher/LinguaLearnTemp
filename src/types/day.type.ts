import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { DayModel } from '../db/rdb/models';

export type Day = InferAttributes<DayModel>;

export type StoreDay = InferCreationAttributes<DayModel> & {
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreDayData = Omit<StoreDay, 'id'>;

export type UpdateDayData = Partial<StoreDayData>;