import { AdminUserModel } from '../db/rdb/models';
import { InferAttributes } from 'sequelize';

export type AdminUser = InferAttributes<AdminUserModel>;

export type AdminUserWithProfessionalId = AdminUser & {
  professional?: {
    id: string;
  };
};
