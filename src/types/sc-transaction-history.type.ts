import { SCTransactionHistoryType } from './common-models.type';

export type SCTransactionHistoryTypeWithTypestampsType =
  SCTransactionHistoryType & {
    createdAt: string;
    updatedAt: string;
  };

export type FormattedSCTransactionHistory = {
  id: string;
  reason: string;
  amount: number;
  createdAt: string;
  tier: null | {
    id: string;
    name: string;
    price: number;
  };
  edu_content: null | {
    id: string;
    category: string;
    title: string;
    price: number;
    is_premium: boolean;
  };
  auction: null | {
    id: string;
    uniqueId: string;
    title: string;
    address: string;
    entry_coins: number;
  };
};

export type SCTransactionResponseEduContentType = {
  edu_content: null | {
    id: string;
    uniqueId: string;
    title: string;
    price: number;
    is_premium: boolean;
  };
};

export type SCTransactionResponseTierType = {
  tier: null | {
    id: string;
    name: string;
    price: number;
  };
};

export type SCTransactionAuctionType = {
  auction: null | {
    id: string;
    uniqueId: string;
    title: string;
    address: string;
    entry_coins: number;
  };
};

export type SCTransactionResponseType = {
  id: string;
  user_id?: string | null;
  admin_user_id?: string | null;
  tier_id?: string | null;
  edu_content_id?: string | null;
  auction_id?: string | null;
  discount_id?: string | null;
  reason: string;
  currency_id?: string;
  amount: number;
  createdAt: string;
} & SCTransactionResponseTierType &
  SCTransactionResponseEduContentType &
  SCTransactionAuctionType;

export type GetSCTransactionType = {
  id: string;
  user_id: string;
  tier_id: string | null;
  edu_content_id: string | null;
  auction_id: string | null;
  reason: string;
  amount: number;
};

export type SCTransactionStoreType = {
  user_id: string;
  tier_id: string | null;
  edu_content_id: string | null;
  auction_id: string | null;
  reason: string;
  amount: number;
};
