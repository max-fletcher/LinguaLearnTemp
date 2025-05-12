import mongoose from 'mongoose';
import { TCreateEduContentPurchase } from '../../../types/edu-content-purchase.types';
import EduContentPurchaseModel from '../model/edu-content-purchase.model';

export class EduContentPurchaseMongoRepository {
  async getEduContentPurchasedInfScroll(
    userId: string,
    beforeDate: string | null = null,
    limit: number = 10,
  ) {
    const findOptions: any = { user_id: userId };

    if (beforeDate) findOptions.createdAt = { $lt: new Date(beforeDate) };

    return await EduContentPurchaseModel.find(findOptions)
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('_id uniqueId edu_content_id createdAt')
      .populate(
        'edu_content_id',
        '_id uniqueId admin_user_id thumbnail_url title currency_id price coins_rewarded',
      )
      .lean();
  }

  async getEduContentPurchasedNextCount(
    userId: string,
    beforeDate: string | null = null,
    offset: number = 10,
  ) {
    const findOptions: any = { user_id: userId };

    if (beforeDate) findOptions.createdAt = { $lt: new Date(beforeDate) };

    return await EduContentPurchaseModel.countDocuments(findOptions)
      .sort({ createdAt: -1 })
      .skip(offset);
  }

  async getEduContentPurchasedByUniqueId(
    uniqueId: string,
    withRelations: boolean = true,
    select: string | null = null,
  ) {
    if (withRelations && select)
      return await EduContentPurchaseModel.findOne({ uniqueId: uniqueId })
        .select(select)
        .populate('edu_content_id')
        .lean();
    if (!withRelations && select)
      return await EduContentPurchaseModel.findOne(
        { uniqueId: uniqueId },
        select,
      ).lean();
    if (withRelations && !select)
      return await EduContentPurchaseModel.findOne({ uniqueId: uniqueId })
        .populate('edu_content_id')
        .lean();

    return await EduContentPurchaseModel.findOne({ uniqueId: uniqueId }).lean();
  }

  async eduContentPurchaseExistsByUniqueId(uniqueId: string) {
    return await EduContentPurchaseModel.exists({ uniqueId: uniqueId }).lean();
  }

  async createEduContentPurchase(
    eduContentPurchase: TCreateEduContentPurchase,
  ) {
    return await EduContentPurchaseModel.create(eduContentPurchase);
  }

  async getEduContentPurchasedByIdsAndAppUserId(_ids: mongoose.Types.ObjectId[], appUserId: string, select: string|null = null) {
    if(select)
      return await EduContentPurchaseModel.find({ edu_content_id: { $in: _ids } , user_id: appUserId }).select(select).lean();

    return await EduContentPurchaseModel.find({ edu_content_id: { $in: _ids } , user_id: appUserId }).lean();
  }
}
