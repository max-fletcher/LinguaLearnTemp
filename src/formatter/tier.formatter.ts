import {
  SingleTierResponse,
  TFormattedPackagePageData,
  TPackagePageData,
  UserTierSubscriptionResponse,
} from '../types/tier.type';
import { roundTo2DP } from '../utils/number.utils';

export function formatGetAllTiers(data: any, mostPopular: number|null): UserTierSubscriptionResponse[] {
  const formattedData: UserTierSubscriptionResponse[] = data.map(
    (tier: any) => {
      return {
        id: tier.id,
        name: tier.name,
        price: tier.price,
        duration: tier.duration,
        coins_rewarded: tier.coins_rewarded,
        perks: tier.perks.length ? tier.perks : null,
        exclusive_access: tier.exclusive_access,
        exclusive_perks:
          tier.exclusive_perks && tier.exclusive_perks.length
            ? tier.exclusive_perks
            : null,
        most_popular: mostPopular && Number(tier.order) === mostPopular ? true : false
      };
    },
  );

  return formattedData;
}

export function formatSingleTier(data: any): SingleTierResponse {
  const formattedData: SingleTierResponse = {
    id: data.id,
    name: data.name,
    price: data.price,
    duration: data.duration,
    coins_rewarded: data.coins_rewarded,
    perks: data.perks.length ? data.perks : null,
    exclusive_access: data.exclusive_access,
    exclusive_perks:
      data.exclusive_perks && data.exclusive_perks.length
        ? data.exclusive_perks
        : null,
  };

  return formattedData;
}

export function formatUserActiveTiers(
  data: any,
): UserTierSubscriptionResponse[] {
  const formattedData: UserTierSubscriptionResponse[] = data.map(
    (tier: any) => {
      return {
        id: tier.id,
        name: tier.name,
        coins_rewarded: tier.coins_rewarded,
        expires_at: tier.tier_statuses[0].end_date,
        perks: tier.perks.length ? tier.perks : null,
        exclusive_access: tier.exclusive_access,
        exclusive_perks:
          tier.exclusive_perks && tier.exclusive_perks.length
            ? tier.exclusive_perks
            : null,
      };
    },
  );

  return formattedData;
}

export function formatPackagePageData(
  data: TPackagePageData,
  memoizedAllTiers: any,
): TFormattedPackagePageData {
  return {
    id: data.id,
    cash_balance: roundTo2DP(Number(data.app_user_balance.cash_balance)),
    coin_balance: Number(data.app_user_balance.coin_balance),
    exp_date: data.app_user_balance.exp_date,
    bronze: {
      id: memoizedAllTiers[1],
      unlocked:
        data.tier_statuses.length > 0 && data.tier_statuses[0].tier.order >= 1
          ? true
          : false,
    },
    silver: {
      id: memoizedAllTiers[2],
      unlocked:
        data.tier_statuses.length > 0 && data.tier_statuses[0].tier.order >= 2
          ? true
          : false,
    },
    gold: {
      id: memoizedAllTiers[3],
      unlocked:
        data.tier_statuses.length > 0 && data.tier_statuses[0].tier.order >= 3
          ? true
          : false,
    },
    platinum: {
      id: memoizedAllTiers[4],
      unlocked:
        data.tier_statuses.length > 0 && data.tier_statuses[0].tier.order === 4
          ? true
          : false,
    },
  };
}
