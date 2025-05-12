import { UserModel } from '../db/rdb/models/user.model';
import { InferAttributes } from 'sequelize';

export type UserMongo = {
  email: string;
  name: string;
};

export type User = InferAttributes<UserModel>;

export type UserWithTimeStamps = {
  id: string
  phone_number: string
  name?: string
  email?: string | null
  password: string
  streak: number
  xpPoints: number
  avatarUrl?: string | null
  nativeLanguage: string
  learningGoal: string
  proficiencyLevel?: string | null
  isNewUser: boolean
  lastLoginAt: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type UserUpdate = {
  phone_number: string
  name?: string
  email?: string | null
  password: string
  streak: number
  xpPoints: number
  avatarUrl?: string | null
  nativeLanguage: string
  learningGoal: string
  proficiencyLevel?: string | null
  isNewUser: boolean
  lastLoginAt: string
  createdAt?: string | null
  updatedAt?: string | null
};

export type AnyStringKeyValuePair = {
  [key: string]: string;
};

export type AppUserGenerateToken = {
  id: string,
  phone_number: string,
  name: string | null,
  email: string | null,
  avatarUrl: string | null
};