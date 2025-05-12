import { UserTierStatusType } from '../types/common-models.type';

export function mapUserTierStatusModel(
  id: string,
  tier_id: string,
  user_id: string,
  start_date: Date,
  end_date: Date | null,
  auto_renewal: boolean,
  cancel_date: Date | null,
  cancel_reason: string | null,
  status: string,
  square_id: string | null | undefined,
): UserTierStatusType {
  return {
    id: id,
    tier_id: tier_id ?? null,
    user_id: user_id ?? null,
    start_date: start_date,
    end_date: end_date ?? null,
    auto_renewal: auto_renewal,
    cancel_date: cancel_date ?? null,
    cancel_reason: cancel_reason ?? null,
    status: status,
    square_id: square_id ? square_id : null,
  };
}
