import { CashBalanceHistoryType } from './common-models.type';

export type CashBalanceHistoryWithTypestampsType = CashBalanceHistoryType & {
  createdAt: string;
  updatedAt: string;
};

export type FormattedCashBalanceHistory = {
  id: string;
  reason: string;
  amount: number;
  createdAt: string;
  tier: null | {
    id: string;
    name: string;
    price: number;
  };
  edu_content: null | string | {
    id: string;
    category: string;
    title: string;
    price: number;
    is_premium: boolean;
  };
};

export type TransactionResponseEduContentType = {
  edu_content: null | {
    id: string;
    uniqueId: string;
    title: string;
    price: number;
    is_premium: boolean;
  };
};

export type TransactionResponseTierType = {
  tier: null | {
    id: string;
    name: string;
    price: number;
  };
};

export type TransactionResponseType = {
  id: string;
  user_id?: string | null;
  admin_user_id?: string | null;
  tier_id?: string | null;
  edu_content_id?: string | null;
  discount_id?: string | null;
  reason: string;
  currency_id?: string;
  amount: number;
  createdAt: string;
} & TransactionResponseEduContentType &
  TransactionResponseTierType;

export type StoreCashBalanceHistory = Omit<CashBalanceHistoryType, 'id'>;
