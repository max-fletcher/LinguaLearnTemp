import { TiersModel } from '../db/rdb/models/tiers.model';
import { InferAttributes } from 'sequelize';

export type Tier = InferAttributes<TiersModel>;

export type UserTierSubscriptionResponse = {
  id: string;
  name: string;
  coins_rewarded: number;
  expires_at: string;
  perks: string[] | null;
  exclusive_access: string;
  exclusive_perks: string[] | null;
};

export type SingleTierResponse = {
  id: string;
  name: string;
  price: number;
  duration: number;
  coins_rewarded: number;
  perks: string[] | null;
  exclusive_access: string;
  exclusive_perks: string[] | null;
};

export type TPackagePageData = {
  id: string;
  name: string | null;
  username: string | null;
  tier_statuses: {
    id: string;
    end_date: string;
    createdAt: string;
    tier: {
      id: string;
      name: string;
      order: number;
    };
  }[];
  app_user_balance: {
    cash_balance: string | number;
    coin_balance: string | number;
    exp_date: string;
  };
};

export type TFormattedPackagePageData = {
  id: string;
  cash_balance: number;
  coin_balance: number;
  exp_date: string;
  bronze: {
    id: string;
    unlocked: boolean;
  };
  silver: {
    id: string;
    unlocked: boolean;
  };
  gold: {
    id: string;
    unlocked: boolean;
  };
  platinum: {
    id: string;
    unlocked: boolean;
  };
};

export type TActiveTiersStatusesWithTiers = {
  id: string
  createdAt: string
  tier: {
    id: string
    name: string
  }
}

export type UpdateTier = {
  name: string;
  price: number;
  duration: number;
  coins_rewarded: number;
  perks: string[];
  stripe_price_id: string;
};

