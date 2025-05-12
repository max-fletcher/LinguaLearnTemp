import { z } from 'zod';
import { TransactionStatus, TransactionTypes } from '../constants/enums';

export const transactionFilterSchema = z.object({
  status: z
    .enum([
      '',
      TransactionStatus.COMPLETED,
      TransactionStatus.PENDING,
      TransactionStatus.FAILED,
    ])
    .optional(),
  search: z.string().optional(),
  transaction_type: z
    .enum([
      '',
      TransactionTypes.CONTENT_PURCHASE,
      TransactionTypes.TIER_PURCHASE,
      TransactionTypes.PAYOUT,
      TransactionTypes.REWARD,
      TransactionTypes.COMMISION,
    ])
    .optional(),
});
