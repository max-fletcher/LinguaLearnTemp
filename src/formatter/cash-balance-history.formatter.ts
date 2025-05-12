import {
  FormattedCashBalanceHistory,
  TransactionResponseType,
} from '../types/cash-balance-history.type';
import { MemoizedEduContentType } from '../types/edu-content.types';

export function formatCashBalanceHistory(
  data: TransactionResponseType[],
  memoizedEduContent: MemoizedEduContentType,
): FormattedCashBalanceHistory[] {
  const formattedData: FormattedCashBalanceHistory[] = data.map(
    (cashbalanceHistory: TransactionResponseType) => {
      return {
        id: cashbalanceHistory.id,
        reason: cashbalanceHistory.reason,
        amount: Number(cashbalanceHistory.amount),
        createdAt: cashbalanceHistory.createdAt,
        tier: !cashbalanceHistory.tier
          ? null
          : {
              id: cashbalanceHistory.tier.id,
              name: cashbalanceHistory.tier.name,
              price: Number(cashbalanceHistory.tier.price),
            },
        edu_content: !cashbalanceHistory.edu_content_id
          ? null
          : cashbalanceHistory.edu_content_id && !memoizedEduContent[cashbalanceHistory.edu_content_id]
            ? 'Edu Content has been deleted !'
            : {
                id: memoizedEduContent[cashbalanceHistory.edu_content_id]
                  .uniqueId,
                category:
                  memoizedEduContent[cashbalanceHistory.edu_content_id].category,
                title:
                  memoizedEduContent[cashbalanceHistory.edu_content_id].title,
                price: Number(
                  memoizedEduContent[cashbalanceHistory.edu_content_id].price,
                ),
                is_premium:
                  memoizedEduContent[cashbalanceHistory.edu_content_id]
                    .is_premium,
              },
      };
    },
  );

  return formattedData;
}
