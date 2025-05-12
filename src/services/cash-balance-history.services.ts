import { CashBalanceHistoryModel } from '../db/rdb/models';
import { CashBalanceHistoryServiceRepository } from '../db/rdb/repositories/cash-balance-history.repository';
import { BadRequestException } from '../errors/BadRequestException.error';
import {
  CashBalanceHistoryWithTypestampsType,
  StoreCashBalanceHistory,
} from '../types/cash-balance-history.type';
import { CashBalanceHistoryType } from '../types/common-models.type';
import { generateCashBalanceHistoryId } from '../utils/id.utils';

export class CashBalanceHistoryService {
  private cashBalanceHistoryServiceRepo: CashBalanceHistoryServiceRepository;

  constructor() {
    this.cashBalanceHistoryServiceRepo =
      new CashBalanceHistoryServiceRepository();
  }

  async getUserCashBalanceHistoryInfScroll(
    userId: string,
    oldestTransactionId: string | null = null,
    limit: number = 10,
  ): Promise<[number, CashBalanceHistoryModel[]]> {
    let beforeDate: string | null = null;
    if (oldestTransactionId) {
      const oldest =
        (await this.cashBalanceHistoryServiceRepo.getCashBalanceHistoryById(
          oldestTransactionId,
        )) as unknown as CashBalanceHistoryWithTypestampsType;

      if (!oldest)
        throw new BadRequestException('Invalid transaction id provided.');

      beforeDate = oldest.createdAt;
    }

    const cashBalanceHistories =
      await this.cashBalanceHistoryServiceRepo.getUserCashBalanceHistoryInfScroll(
        userId,
        beforeDate,
        limit,
      );
    const next =
      ((await this.cashBalanceHistoryServiceRepo.getUserCashBalanceHistoryNext(
        userId,
        beforeDate,
      )) as unknown as number) - limit;

    return [next, cashBalanceHistories];
  }

  async storeCashBalanceHistory(
    data: StoreCashBalanceHistory,
  ): Promise<CashBalanceHistoryType> {
    const id = generateCashBalanceHistoryId();
    return await this.cashBalanceHistoryServiceRepo.storeCashBalanceHistory({
      id,
      ...data,
    });
  }
}
