import {
  FormattedSCTransactionHistory,
  SCTransactionResponseType,
} from '../types/sc-transaction-history.type';
import { MemoizedEduContentType } from '../types/edu-content.types';
import { MemoizedAuctionType } from '../types/auction-batch.type';

export function formatSCTransactionHistory(
  data: SCTransactionResponseType[],
  memoizedEduContent: MemoizedEduContentType,
  memoizedAuctionBatches: MemoizedAuctionType,
): FormattedSCTransactionHistory[] {
  const formattedData: FormattedSCTransactionHistory[] = data.map(
    (scTransactionHistory: SCTransactionResponseType) => {
      return {
        id: scTransactionHistory.id,
        reason: scTransactionHistory.reason,
        amount: Number(scTransactionHistory.amount),
        createdAt: scTransactionHistory.createdAt,
        tier: !scTransactionHistory.tier
          ? null
          : {
              id: scTransactionHistory.tier.id,
              name: scTransactionHistory.tier.name,
              price: Number(scTransactionHistory.tier.price),
            },
        edu_content:
          !scTransactionHistory.edu_content_id ||
          !memoizedEduContent[scTransactionHistory.edu_content_id]
            ? null
            : {
                id: memoizedEduContent[scTransactionHistory.edu_content_id]._id,
                uniqueId:
                  memoizedEduContent[scTransactionHistory.edu_content_id]
                    .uniqueId,
                category:
                  memoizedEduContent[scTransactionHistory.edu_content_id]
                    .category,
                title:
                  memoizedEduContent[scTransactionHistory.edu_content_id].title,
                price: Number(
                  memoizedEduContent[scTransactionHistory.edu_content_id].price,
                ),
                is_premium:
                  memoizedEduContent[scTransactionHistory.edu_content_id]
                    .is_premium,
              },
        auction:
          !scTransactionHistory.auction_id ||
          !memoizedAuctionBatches[scTransactionHistory.auction_id]
            ? null
            : {
                id: memoizedAuctionBatches[scTransactionHistory.auction_id]._id,
                uniqueId:
                  memoizedAuctionBatches[scTransactionHistory.auction_id]
                    .uniqueId,
                title:
                  memoizedAuctionBatches[scTransactionHistory.auction_id].title,
                address:
                  memoizedAuctionBatches[scTransactionHistory.auction_id]
                    .address,
                entry_coins:
                  memoizedAuctionBatches[scTransactionHistory.auction_id]
                    .entry_coins,
              },
      };
    },
  );

  return formattedData;
}
