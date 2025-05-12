import { PayoutRequestModel } from '../../db/rdb/models';
import { PayoutRepository } from '../../db/rdb/repositories/payout.repository';
import { BadRequestException } from '../../errors/BadRequestException.error';
import { PayoutRequestWithTimestampsType } from '../../types/payout-request.type';
import { generatePayoutRequestId } from '../../utils/id.utils';

export class PayoutService {
  private payoutRepo: PayoutRepository;

  constructor() {
    this.payoutRepo = new PayoutRepository();
  }

  async getAppUserPayoutsInfScroll(
    userId: string,
    oldestPayoutReqId: string | null = null,
    limit: number = 10,
  ): Promise<[number, PayoutRequestModel[]]> {
    let beforeDate: string | null = null;
    if (oldestPayoutReqId) {
      const oldest = (await this.payoutRepo.findPayoutRequestById(
        oldestPayoutReqId,
      )) as unknown as PayoutRequestWithTimestampsType;

      if (!oldest)
        throw new BadRequestException('Invalid payout request id provided.');

      beforeDate = oldest.createdAt;
    }

    const paymentRequests =
      await this.payoutRepo.getUserPayoutRequestsInfScroll(
        userId,
        beforeDate,
        limit,
      );
    const next =
      ((await this.payoutRepo.getPayoutRequestsNext(
        userId,
        beforeDate,
      )) as unknown as number) - limit;

    return [next, paymentRequests];
  }

  async appUserCreatePayoutRequest(
    userId: string,
    data: any,
    currency_id: string,
  ) {
    const id = generatePayoutRequestId();
    return await await this.payoutRepo.appUserCreatePayoutRequest({
      id: id,
      user_id: userId,
      currency_id: currency_id,
      ...data,
      status: 'PENDING',
    });
  }
}
