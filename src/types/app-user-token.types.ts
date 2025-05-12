import { InferAttributes } from 'sequelize';
import { AppUserTokenModel } from '../db/rdb/models/app-user-tokens.model';

export type AppUserToken = InferAttributes<AppUserTokenModel>;