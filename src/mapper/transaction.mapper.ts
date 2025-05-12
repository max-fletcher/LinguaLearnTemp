import { TransactionPaymentMethodTypes } from '../constants/enums';
import { TransactionType } from '../types/common-models.type';

export function mapToTransactionModel(
  id: string,
  user_id: string | null,
  admin_user_id: string | null,
  discount_id: string | null,
  edu_content_id: string | null,
  tier_id: string | null,
  payout_request_id: string | null,
  transaction_type: string,
  currency_id: string,
  amount: number,
  // stripe_id: string | null,
  square_id: string | null,
  payment_method: string | null,
  status: string,
): TransactionType {
  return {
    id: id,
    user_id: user_id ?? null,
    admin_user_id: admin_user_id ?? null,
    edu_content_id: edu_content_id ?? null,
    discount_id: discount_id ?? null,
    tier_id: tier_id ?? null,
    payout_request_id: payout_request_id ?? null,
    transaction_type: transaction_type,
    currency_id: currency_id,
    amount: amount,
    // stripe_id: stripe_id ?? null,
    square_id: square_id ?? null,
    payment_method: payment_method ?? TransactionPaymentMethodTypes.CREDIT_CARD,
    status: status,
  };
}
