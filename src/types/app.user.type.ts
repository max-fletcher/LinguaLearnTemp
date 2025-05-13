import { UserModel } from '../db/rdb/models/app-user.model';
import { InferAttributes } from 'sequelize';

export type UserMongo = {
  email: string;
  name: string;
};

export type User = InferAttributes<UserModel>;

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

export type StoreAppUser = {
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
  createdAt?: string | null
  updatedAt?: string | null
};

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