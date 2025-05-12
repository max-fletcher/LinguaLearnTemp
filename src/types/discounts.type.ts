import { InferAttributes } from 'sequelize';
import { DiscountsModel } from '../db/rdb/models/discounts.model';

export type DiscountTypes = InferAttributes<DiscountsModel>;
