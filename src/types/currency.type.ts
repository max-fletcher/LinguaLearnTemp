import { CurrencyModel } from '../db/rdb/models/currency.model';
import { InferAttributes } from 'sequelize';

export type Currency = InferAttributes<CurrencyModel>;

export type CurrencyData = Currency & {
  id: string;
  createdAt?: string;
  updatedAtAt?: string;
};
