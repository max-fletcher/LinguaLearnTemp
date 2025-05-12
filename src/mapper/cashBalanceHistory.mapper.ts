import { CashBalanceHistoryType } from '../types/common-models.type';

export function mapToCashBalanceHistoryModel(
  id: string,
  user_id: string | null,
  admin_user_id: string | null,
  tier_id: string | null,
  edu_content_id: string | null,
  discount_id: string | null,
  reason: string,
  currency_id: string,
  amount: number,
): CashBalanceHistoryType {
  return {
    id: id,
    user_id: user_id ?? null,
    admin_user_id: admin_user_id ?? null,
    tier_id: tier_id ?? null,
    edu_content_id: edu_content_id ?? null,
    discount_id: discount_id ?? null,
    reason: reason,
    currency_id: currency_id,
    amount: amount,
  };
}
