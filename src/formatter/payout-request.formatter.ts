import {
  FormattedPayoutRequests,
  PayoutRequestResponseType,
} from '../types/payout-request.type';

export function formatPayoutRequests(
  data: PayoutRequestResponseType[],
): FormattedPayoutRequests[] {
  const formattedData: FormattedPayoutRequests[] = data.map(
    (payoutReq: PayoutRequestResponseType) => {
      return {
        id: payoutReq.id,
        amount: Number(payoutReq.amount),
        currency: payoutReq.currency.short_name,
        createdAt: payoutReq.createdAt,
      };
    },
  );

  return formattedData;
}
