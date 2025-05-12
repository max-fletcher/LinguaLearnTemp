import {
  PayoutRequestType,
  SCTransactionHistoryType,
} from './common-models.type';

export type SCTransactionHistoryTypeWithTypestampsType =
  SCTransactionHistoryType & {
    createdAt: string;
    updatedAt: string;
  };

export type FormattedPayoutRequests = {
  id: string;
  amount: number;
  currency: string;
  createdAt: string;
};

export type PayoutRequestWithTimestampsType = PayoutRequestType & {
  createdAt: string;
  updatedAt: string;
};

export type PayoutRequestResponseType = PayoutRequestType & {
  currency: {
    id: string;
    name?: string;
    short_name: string;
  };
  createdAt: string;
  updatedAt: string;
};
