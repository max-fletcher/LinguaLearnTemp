import { Transaction } from 'sequelize';

export type updateUserOptions = {
  where: {
    id: string;
  };
  transaction?: Transaction;
};

export type dbTransactionOptions = {
  transaction?: Transaction;
};
