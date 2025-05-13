import { AppUserModel } from '../db/rdb/models/app-user.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

export type UserMongo = {
  email: string;
  name: string;
};

export type User = InferAttributes<AppUserModel>;

export type UserWithTimeStamps = {
  id: string
  phoneNumber: string
  firstName: string
  lastName: string
  email?: string | null
  password: string
  streak: number
  xpPoints: number
  avatarUrl: string | null
  nativeLanguage: string
  learningGoal: string
  proficiencyLevel: string | null
  isNewUser: boolean
  lastLoginAt: string
  verified: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreAppUser = InferCreationAttributes<AppUserModel> & {
  createdAt?: string | null
  updatedAt?: string | null
};

export type StoreAppUserData = Omit<StoreAppUser, 'id'>;

export type UpdateAppUser = {
  id?: string
  phoneNumber: string
  firstName: string
  lastName: string
  email: string | null
  password: string
  streak: number
  xpPoints: number
  avatarUrl: string | null
  nativeLanguage: string
  learningGoal: string
  proficiencyLevel?: string | null
  isNewUser: boolean
  lastLoginAt: string
  verified: string
  updatedBy: string
  deletedAt: string | null
  deletedBy: string | null
  createdAt?: string | null
  updatedAt?: string | null
};

export type AnyStringKeyValuePair = {
  [key: string]: string;
};

export type AppUserGenerateToken = {
  id: string,
  phoneNumber: string,
  name: string | null,
  email: string | null,
  avatarUrl: string | null
};