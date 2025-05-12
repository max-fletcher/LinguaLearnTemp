import { InferAttributes } from 'sequelize';
import {
  AdminUserModel,
  CashBalanceHistoryModel,
  PayoutRequestModel,
  ProfessionalEducationModel,
  ProfessionalExperienceModel,
  ProfessionalModel,
  SCTransactionHistoryModel,
  TiersModel,
  TransactionModel,
  UserBalanceModel,
  UserTierStatusModel,
} from '../db/rdb/models';

export type TierType = InferAttributes<TiersModel>;
export type ProfessionalExperience =
  InferAttributes<ProfessionalExperienceModel>;
export type ProfessionalEducation = InferAttributes<ProfessionalEducationModel>;
export type ProfessionalType = InferAttributes<ProfessionalModel>;
export type PayoutRequest = InferAttributes<PayoutRequestModel>;
export type TransactionType = InferAttributes<TransactionModel>;
export type UserBalanceType = InferAttributes<UserBalanceModel>;
export type CashBalanceHistoryType = InferAttributes<CashBalanceHistoryModel>;
export type UserTierStatusType = InferAttributes<UserTierStatusModel>;
export type SCTransactionHistoryType =
  InferAttributes<SCTransactionHistoryModel>;
export type PayoutRequestType = InferAttributes<PayoutRequestModel>;
export type AdminUser = InferAttributes<AdminUserModel>;
