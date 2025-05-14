import { AppUserModel } from '../db/rdb/models/app-user.model';
import { InferAttributes, InferCreationAttributes } from 'sequelize';

export type AppUser = InferAttributes<AppUserModel>;

export type AppUserWithTimeStamps = {
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

export type UpdateAppUserData = Partial<StoreAppUserData>;

export type AppUserGenerateToken = {
  id: string,
  phoneNumber: string,
  name: string | null,
  email: string | null,
  avatarUrl: string | null
};