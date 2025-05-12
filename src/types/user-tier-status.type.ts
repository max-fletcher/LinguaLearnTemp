import { Transaction } from 'sequelize';
// import { UserTierStatusModel } from "../db/rdb/models"

export type addSubCashCoinBalanceOptions = {
  type: string;
  transaction?: Transaction;
};
