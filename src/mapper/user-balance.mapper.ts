import { UserBalanceType } from '../types/common.type';

export function mapToUserBalanceModel(
  id: string,
  user_id: string | null,
  admin_user_id: string | null,
  cash_balance?: number,
  coin_balance?: number,
  exp_date?: Date | null,
): UserBalanceType {
  return {
    id: id,
    user_id: user_id,
    admin_user_id: admin_user_id,
    cash_balance: cash_balance ?? 0,
    coin_balance: coin_balance ?? 0,
    exp_date: exp_date ?? new Date(),
  };
}
