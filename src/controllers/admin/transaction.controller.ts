import { Response } from 'express';
import { TransactionService } from '../../services/admin/transaction.service';
import { AdminAuthenticatedRequest } from '../../types/authenticate.type';

const transactionService = new TransactionService();

export async function getTransactions(
  req: AdminAuthenticatedRequest,
  res: Response,
) {
  try {
    const response = await transactionService.getAllTransactions(req);

    return res.send({
      transactions: response.transactions,
      transaction_statics: response.transaction_statics,
    });
  } catch (error) {
    return res.status(500).send({
      error: error,
    });
  }
}
