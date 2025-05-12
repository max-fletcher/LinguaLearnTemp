import { Op } from 'sequelize';
import { TransactionTypes } from '../../constants/enums';
import { TransactionRepository } from '../../db/rdb/repositories/transaction.repository';

export class TransactionService {
  private transactionRepo: TransactionRepository;

  constructor() {
    this.transactionRepo = new TransactionRepository();
  }

  async getAllTransactions(request: any) {
    const transactions = await this.transactionRepo.getAllTransactions(
      request.query,
    );

    const transaction_statics = {
      total_transactions: await this.transactionRepo.getTransactionCount({}),
      total_purchase: await this.transactionRepo.getTransactionCount({
        where: {
          transaction_type: {
            [Op.or]: [
              TransactionTypes.CONTENT_PURCHASE,
              TransactionTypes.TIER_PURCHASE,
            ],
          },
        },
      }),
      total_in: await this.transactionRepo.getTransactionSum({
        where: {
          transaction_type: {
            [Op.or]: [
              TransactionTypes.CONTENT_PURCHASE,
              TransactionTypes.TIER_PURCHASE,
            ],
          },
        },
      }),
      total_disbursement: await this.transactionRepo.getTransactionSum({
        transaction_type: {
          [Op.or]: [
            TransactionTypes.PAYOUT,
            TransactionTypes.REWARD,
            TransactionTypes.COMMISION,
          ],
        },
      }),
    };

    return {
      transactions,
      transaction_statics,
    };
  }
}
