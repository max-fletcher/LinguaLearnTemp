import mongoose from 'mongoose';
import { EduContentPurchaseMongoRepository } from '../db/nosql/repository/edu-content-purchase.repository';
import { AppUserGenerateToken } from '../types/app.user.type';
import { TEduContentPurchaseWithTimestamps } from '../types/edu-content-purchase.types';

export class EducationalContentPurchasedService {
  private eduContentPurchaseMongoRepo: EduContentPurchaseMongoRepository;

  constructor() {
    this.eduContentPurchaseMongoRepo = new EduContentPurchaseMongoRepository();
  }

  async getInfScrollEduContentPurchasedService(
    appUser: AppUserGenerateToken,
    oldestEduContentPurchaseId: string | null | undefined,
    limit: number = 10,
  ) {
    const select = 'createdAt';
    let oldestEduContentPurchase;
    let eduContentPurchased;
    let next;

    if (oldestEduContentPurchaseId)
      oldestEduContentPurchase =
        (await this.eduContentPurchaseMongoRepo.getEduContentPurchasedByUniqueId(
          oldestEduContentPurchaseId,
          false,
          select,
        )) as unknown as TEduContentPurchaseWithTimestamps;

    if (oldestEduContentPurchase) {
      eduContentPurchased =
        await this.eduContentPurchaseMongoRepo.getEduContentPurchasedInfScroll(
          appUser.id,
          oldestEduContentPurchase.createdAt,
          limit,
        );
      next =
        await this.eduContentPurchaseMongoRepo.getEduContentPurchasedNextCount(
          appUser.id,
          oldestEduContentPurchase.createdAt,
          limit,
        );
      return { next, eduContentPurchased: eduContentPurchased };
    }

    eduContentPurchased =
      await this.eduContentPurchaseMongoRepo.getEduContentPurchasedInfScroll(
        appUser.id,
        null,
        limit,
      );
    next =
      await this.eduContentPurchaseMongoRepo.getEduContentPurchasedNextCount(
        appUser.id,
        null,
        limit,
      );
    return { next, eduContentPurchased: eduContentPurchased };
  }

  async getEduContentPurchasedByIdsAndAppUserId(_ids: mongoose.Types.ObjectId[], appUserId: string, select: string|null = null) {
    return await this.eduContentPurchaseMongoRepo.getEduContentPurchasedByIdsAndAppUserId(_ids, appUserId, select)
  }
}
