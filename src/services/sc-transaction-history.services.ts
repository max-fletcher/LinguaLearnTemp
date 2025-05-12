import { SCTransactionHistoryRepository } from '../db/rdb/repositories/sc-transaction-history.repository';
import { SCTransactionHistoryModel } from '../db/rdb/models';
import { BadRequestException } from '../errors/BadRequestException.error';
import { SCTransactionHistoryType } from '../types/common-models.type';
import {
  SCTransactionHistoryTypeWithTypestampsType,
  SCTransactionStoreType,
} from '../types/sc-transaction-history.type';
import { generateSCBalanceHistoryId } from '../utils/id.utils';

export class SCTransactionHistoryService {
  private scTransactionHistoryRepo: SCTransactionHistoryRepository;

  constructor() {
    this.scTransactionHistoryRepo = new SCTransactionHistoryRepository();
  }

  async getUserSCTransactionHistoryInfScroll(
    userId: string,
    oldestSCTransId: string | null = null,
    limit: number = 10,
  ): Promise<[number, SCTransactionHistoryModel[]]> {
    let beforeDate: string | null = null;
    if (oldestSCTransId) {
      const oldest =
        (await this.scTransactionHistoryRepo.getSCTrasnactionHistoryById(
          oldestSCTransId,
        )) as unknown as SCTransactionHistoryTypeWithTypestampsType;

      if (!oldest)
        throw new BadRequestException(
          'Invalid sweep coin transaction id provided.',
        );

      beforeDate = oldest.createdAt;
    }

    const next =
      ((await this.scTransactionHistoryRepo.getUserTransactionHistoryNext(
        userId,
        beforeDate,
      )) as unknown as number) - limit;
    
    const scTransactionHistories =
      await this.scTransactionHistoryRepo.getUserTransactionHistoryInfScroll(
        userId,
        beforeDate,
        limit,
      );

    return [next, scTransactionHistories];
  }

  async storeSCTransactionHistory(
    data: SCTransactionStoreType,
  ): Promise<SCTransactionHistoryType> {
    const id = generateSCBalanceHistoryId();
    return await this.scTransactionHistoryRepo.storeSCTransactionHistories({
      id,
      ...data,
    });
  }
}
